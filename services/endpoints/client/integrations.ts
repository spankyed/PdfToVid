import createRequest from "../shared/request";

const workerService = createRequest('http://localhost:4000');

export async function worker(record: any) {
  return {
    scrape: (params: any) => workerService.post('scrape', params),
  };
}
