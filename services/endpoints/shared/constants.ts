export const root = '/Users/spankyed/Develop/Projects/CurateGPT/services/';

export const ports = {
  web: 5173,
  client: 3000,
  database: 4000,
  status: 5000,
  worker: 6000,
};

export const WebPath = `http://localhost:${ports.web}`;
export const ClientPath = `localhost:${ports.client}`;
export const DatabasePath = `localhost:${ports.database}`;
export const StatusPath = `localhost:${ports.status}`;
export const WorkerPath = `localhost:${ports.worker}`;
