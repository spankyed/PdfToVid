import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import getStore, { DayDocument, PaperDocument, TableTypes } from './schema';
import { chain, left, map } from 'fp-ts/TaskEither';
import { TaskEither, tryCatchK } from 'fp-ts/lib/TaskEither';

type CreateError = Error; // You can further refine this if there are specific error shapes for each operation
type CreateSuccess = void; // Assuming creating doesn't return anything

type ReadError = Error;
type ReadSuccess = Array<DayDocument | PaperDocument | { lastRun: string }>;

type UpdateError = Error;
type UpdateSuccess = { message: string };

type DeleteError = Error;
type DeleteSuccess = { message: string };

// Map these types to the operations

type OperationResults = {
  create: CreateSuccess;
  read: ReadSuccess;
  update: UpdateSuccess;
  delete: DeleteSuccess;
};

type OperationErrors = {
  create: CreateError;
  read: ReadError;
  update: UpdateError;
  delete: DeleteError;
};

const TableKey = t.keyof({
  days: null,
  papers: null,
  config: null
});
const CreateParams = t.type({
  table: TableKey,
  record: t.unknown
});
export const ReadParams = t.type({
  table: TableKey,
  query: t.union([t.unknown, t.undefined]),
  skip: t.union([t.number, t.undefined]),
  limit: t.union([t.number, t.undefined]),
  order: t.union([t.unknown, t.undefined])
});
const UpdateParams = t.type({
  table: TableKey,
  query: t.unknown,
  updateQuery: t.unknown
});
const DeleteParams = t.type({
  table: TableKey,
  query: t.unknown
});
const CreatePayload = t.intersection([t.type({ operation: t.literal('create') }), CreateParams]);
const UpdatePayload = t.intersection([t.type({ operation: t.literal('update') }), UpdateParams]);
const DeletePayload = t.intersection([t.type({ operation: t.literal('delete') }), DeleteParams]);
type OperationDetails = {
  create: t.TypeOf<typeof CreateParams>;
  update: t.TypeOf<typeof UpdateParams>;
  delete: t.TypeOf<typeof DeleteParams>;
};
export const Payload = t.union([CreatePayload, UpdatePayload, DeletePayload]);
export type Dispatcher = {
  [K in keyof OperationDetails]: (params: OperationDetails[K]) => TaskEither<OperationErrors[K], OperationResults[K]>;
};

function create(params: t.TypeOf<typeof CreateParams>): TaskEither<Error, void> {
  const insertIntoStore = tryCatchK(
    (params: t.TypeOf<typeof CreateParams>) => getStore(params.table).insertAsync(params.record),
    (error: any) => error as Error
  );

  const checkExistingRecord = tryCatchK(
    (params: t.TypeOf<typeof CreateParams>) => getStore(params.table).findOneAsync(params.record),
    (error: any) => error as Error
  );

  return pipe(
    checkExistingRecord(params),
    chain(existingRecord => existingRecord 
      ? left(new Error('Record already exists')) 
      : pipe(
          insertIntoStore(params),
          map(() => {})  // This ensures that the return type is void
        )
    )
  );
}

function read<T extends keyof TableTypes>(params: t.TypeOf<typeof ReadParams> & { table: T }): TaskEither<Error, any[]> {
  const { table, query = {}, skip = 0, limit = -1, order = null } = params;

  const findInStore = tryCatchK(
    ({ table, query, skip, limit, order }: t.TypeOf<typeof ReadParams> & { table: T }) => {
      const cursor = getStore(table).findAsync(query);
      if (order) cursor.sort(order);
      if (limit !== undefined && limit !== -1) cursor.limit(limit);
      return cursor.skip(skip || 0).execAsync();
    },
    (error: any) => error as Error
  );

  return findInStore({ table, query, skip, limit, order });
}

function update(params: t.TypeOf<typeof UpdateParams>): TaskEither<Error, { message: string }> {
  const updateInStore = tryCatchK(
    (params: t.TypeOf<typeof UpdateParams>) => 
      getStore(params.table).updateAsync(params.query, params.updateQuery, { upsert: true }),
    (error: any) => error as Error
  );

  return pipe(
    updateInStore(params),
    map(() => ({ message: 'Record updated successfully' }))
  );
}

function _delete(params: t.TypeOf<typeof DeleteParams>): TaskEither<Error, { message: string }> {
  const deleteFromStore = tryCatchK(
    (params: t.TypeOf<typeof DeleteParams>) => getStore(params.table).removeAsync(params.query, { multi: true }),
    (error: any) => error as Error
  );
  
  return pipe(
    deleteFromStore(params),
    map(() => ({ message: 'Record deleted successfully' }))
  );
}

const postDispatcher: Dispatcher = { create, update, delete: _delete };

export { read, postDispatcher }
