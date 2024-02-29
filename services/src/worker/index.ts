import Hapi from '@hapi/hapi';
import { ports } from '../shared/constants';
import createServer from '../shared/server';
import dispatcher from './service/dispatcher';
// import setup from './service/setup';

const serverConfig: Hapi.ServerOptions | undefined = { port: ports.worker };

const routes = [
  {
    method: 'POST',
    path: '/{action}',
    handler: async (request, h) => {
      const action = request.params.action;

      if (dispatcher[action]) {
        try {
          const result = await dispatcher[action](request.payload);
          return h.response(result).code(200);
        } catch (error) {
          return h.response(error.message).code(500);
        }
      } else {
        return h.response('Action not recognized').code(400);
      }
    }
  },
];

(async function start () {
  const server = createServer(serverConfig, routes);

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Worker service running at:', server.info.uri);
})();


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
