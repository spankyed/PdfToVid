import { WorkerPath } from "../shared/constants";
import createRequest from "../shared/request";

const workerService = createRequest(WorkerPath);

export const worker = {
  scrape: (params: any) => workerService.post('scrape', params),
  generate: (params: any) => workerService.post('generate', params),
  auto: (params: any) => workerService.post('auto', params),
  // completion: (params: any) => workerService.post('auto', params),
}
