export const root = '/Users/spankyed/Develop/Projects/CurateGPT/services/';

export const ports = {
  client: 5173,
  web: 3000,
  worker: 6000,
};

export const ClientPath = `http://localhost:${ports.client}`; // to allow web requests CORS
export const WebServerPath = `http://localhost:${ports.web}`;
export const WorkerPath = `http://localhost:${ports.worker}`;
