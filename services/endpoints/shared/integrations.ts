import createRequest from "../shared/request";
import { RecordTypes } from "../shared/types";
import { DatabasePath } from "./constants";

const dbService = createRequest(DatabasePath);

type TableKey = "days" | "papers" | "config";

type CreateParams = {
  table: TableKey;
  record: RecordTypes;
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

export const database = {
  create: (params: CreateParams) => dbService.post('create', params),
  read: (params: ReadParams) => dbService.get('read', params),
  update: (params: UpdateParams) => dbService.post('update', params),
  delete: (params: DeleteParams) => dbService.post('delete', params),
}