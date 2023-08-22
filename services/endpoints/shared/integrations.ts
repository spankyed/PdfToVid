import createRequest from "../shared/request";
import { RecordTypes } from "../shared/types";

const dbService = createRequest('http://localhost:3000');

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

export async function database(record: any) {
  return {
    create: (params: CreateParams) => dbService.post('create', params),
    read: (params: ReadParams) => dbService.get('read', params),
    update: (params: UpdateParams) => dbService.post('update', params),
    delete: (params: DeleteParams) => dbService.post('delete', params),
  };
}
