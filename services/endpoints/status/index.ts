import type Hapi from '@hapi/hapi';
import createServer, { Routes } from '../shared/server';
import { getStatus, setStatus, updateStatus } from './functions';
import { ports } from '../shared/constants';

const serverConfig: Hapi.ServerOptions | undefined = { port: ports.status };

const routes: Routes = [
  {
    method: 'POST',
    path: '/check/{type}',
    handler: async (request, h) => {
      const type = request.params.type;
      const key = request.payload.key;

      // return { current: 'scraping'}
      // return { current: 'scraping', updated: true }

      const status = getStatus(type, key);

      if (status) {
        return h.response({ status }).code(200);
      } else {
        return h.response({ error: 'No status found' }).code(404);
      }
    }
  },
  {
    method: 'POST',
    path: '/set/{type}',
    handler: async (request, h) => {
      const type = request.params.type;

      if (setStatus(type, request.payload)) {
        return h.response({ status: request.payload.status }).code(200);
      } else {
        return h.response({ error: 'Unable to set status' }).code(400);
      }
    }
  },
  {
    method: 'POST',
    path: '/update/{type}',
    handler: async (request, h) => {
      const type = request.params.type;

      if (updateStatus(type, request.payload)) {
        return h.response({ status: request.payload.status }).code(200);
      } else {
        return h.response({ error: 'Unable to update status' }).code(400);
      }
    }
  },
];

(async function start () {
  // todo retrieve and sync active statuses
  const server = createServer(serverConfig, routes);

  try {
    // await server.register(Cors);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Status service running at:', server.info.uri);
})();
