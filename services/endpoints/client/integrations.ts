import createRequest from "../shared/request";

const workerService = createRequest('http://localhost:4000');

export const worker = {
  scrape: (params: any) => workerService.post('scrape', params),
  generate: (params: any) => workerService.post('generate', params),
  auto: (params: any) => workerService.post('auto', params),
  // completion: (params: any) => workerService.post('auto', params),
}