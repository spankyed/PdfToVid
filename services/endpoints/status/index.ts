import type Hapi from '@hapi/hapi';
import createServer, { Routes } from '../shared/server';
import { getStatus, setStatus, updateStatus } from './functions';
import { ports } from '../shared/constants';
import mocks from '../../../tests/mocks';

const serverConfig: Hapi.ServerOptions | undefined = { port: ports.status };

const routes: Routes = [
  {
    method: 'POST',
    path: '/check',
    handler: async (request, h) => {
      const { type, key } = request.payload;
      console.log('{ type, key }: ', { type, key });

      return { current: 'complete', updated: true, data: mocks.paperList[0].papers };

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
    path: '/set',
    handler: async (request, h) => {
      const { type, key, status } = request.payload;

      if (setStatus(type, key, status)) {
        return h.response({ status }).code(200);
      } else {
        return h.response({ error: 'Unable to set status' }).code(400);
      }
    }
  },
  {
    method: 'POST',
    path: '/update',
    handler: async (request, h) => {
      const { type, key, status } = request.payload;

      if (updateStatus(type, key, status)) {
        return h.response({ status }).code(200);
      } else {
        return h.response({ error: 'Unable to update status' }).code(400);
      }
    }
  },
];

(async function start () {
  // todo retrieve and sync statuses
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
