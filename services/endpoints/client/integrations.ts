import createRequest from "../shared/request";

const workerService = createRequest('http://localhost:4000');
const statusService = createRequest('http://localhost:5000');

export const worker = {
  scrape: (params: any) => workerService.post('scrape', params),
  generate: (params: any) => workerService.post('generate', params),
  auto: (params: any) => workerService.post('auto', params),
  // completion: (params: any) => workerService.post('auto', params),
}

export const status = {
  check: (params: any) => statusService.post('check', params),
}
