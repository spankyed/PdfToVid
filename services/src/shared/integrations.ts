import createRequest from "../shared/request";
import { RecordTypes } from "../shared/types";
import { DatabasePath } from "./constants";

type TableKey = "days" | "papers" | "config";

type CreateParams = {
  table: TableKey;
  record: RecordTypes | RecordTypes[];
};

type ReadParams = {
  table: TableKey;
  query?: any;
  skip?: number;
  limit?: number;
  order?: any;
};

type UpdateParams = {
  table: TableKey;
  query: any;
  updateQuery: any;
};

type DeleteParams = {
  table: TableKey;
  query: any;
};

const dbService = createRequest(DatabasePath);

export const database = {
  create: (params: CreateParams) => dbService.post('db', { operation: 'create', ...params }),
  read: (params: ReadParams) => {
    if (params.query) params.query = JSON.stringify(params.query);
    if (params.order) params.order = JSON.stringify(params.order);

    return dbService.get<RecordTypes[]>('db', { operation: 'read', ...params })
  },
  update: (params: UpdateParams) => dbService.post('db', { operation: 'update', ...params }),
  delete: (params: DeleteParams) => dbService.post('db', { operation: 'delete', ...params }),
}
