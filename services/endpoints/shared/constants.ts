export const root = '/Users/spankyed/Develop/Projects/CurateGPT/services/';

export const ports = {
  web: 5173,
  client: 3000,
  database: 4000,
  status: 5000,
  worker: 6000,
};

export const WebPath = `http://localhost:${ports.web}`;

export const ClientPath = `http://localhost:${ports.client}`;
export const DatabasePath = `http://127.0.0.1:${ports.database}`;
export const StatusPath = `http://localhost:${ports.status}`;
export const WorkerPath = `http://localhost:${ports.worker}`;
