import createRequest from "../shared/request";

const dbService = createRequest('http://localhost:3000');
// const workerService = createRequest('http://localhost:4000');

export async function createRecord(record: any): Promise<void> {
  const endpoint = 'create';
  return dbService('post', endpoint, record);
}