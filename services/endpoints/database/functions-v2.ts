import Datastore from '@seald-io/nedb';
import path from 'path';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';

const dbPath = (name: string) => path.join(__dirname, 'database', `${name}.db`);

const store = {
  table: new Datastore<any>({ filename: dbPath('table'), autoload: true }),
};

const CreatePayload = t.type({
  operation: t.literal('create'),
  table: t.string,
  record: t.unknown
});

const UpdatePayload = t.type({
  operation: t.literal('update'),
  table: t.string,
  query: t.unknown,
  updateQuery: t.unknown
});

const DeletePayload = t.type({
  operation: t.literal('delete'),
  table: t.string,
  query: t.unknown
});

export const Payload = t.union([CreatePayload, UpdatePayload, DeletePayload]);
type OperationPayloads = {
  create: t.TypeOf<typeof CreatePayload>;
  update: t.TypeOf<typeof UpdatePayload>;
  delete: t.TypeOf<typeof DeletePayload>;
};
export type Dispatcher = {
  [K in keyof OperationPayloads]: (params: OperationPayloads[K]) => Promise<any>;
};


async function create({ table, record }: t.TypeOf<typeof CreatePayload>) {
  const existingRecord = await store[table].findOneAsync(record);
  if (existingRecord) {
    throw new Error('Record already exists');
  }
  await store[table].insertAsync(record);
}

// async function read({ table, query = {}, skip = 0, limit = -1, order = null }: { table: string; query: any; skip?: number; limit?: number; order?: any }) {
//   let dbQuery = store[table].findAsync(query);

//   if (order) {
//     dbQuery = dbQuery.sort(order);
//   }

//   if (limit !== -1) {
//     dbQuery = dbQuery.limit(limit);
//   }

//   const records = await dbQuery.skip(skip).execAsync();
//   return records;
// }

async function update({ table, query, updateQuery }: t.TypeOf<typeof UpdatePayload>) {
  await store[table].updateAsync(query, updateQuery, { upsert: true });
  return { message: 'Record updated successfully' };
}

async function _delete({ table, query }: t.TypeOf<typeof DeletePayload>) {
  await store[table].removeAsync(query);
  return { message: 'Record deleted successfully' };
}



const postDispatcher: Dispatcher = { create, update, delete: _delete };

export { postDispatcher }

// export type OperationType = 'create' | 'update' | 'delete';
// export type CreateParams = { table: string; record: any; };
// export type UpdateParams = { table: string; query: any; updateQuery: any; };
// export type DeleteParams = { table: string; query: any; };
// export type Payload = { operation: OperationType } & (CreateParams | UpdateParams | DeleteParams);
// export type Dispatcher = {
//   [K in OperationType]: (params: Extract<Payload, { operation: K }>) => Promise<any>;
// };