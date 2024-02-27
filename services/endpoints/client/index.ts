import type Hapi from '@hapi/hapi';
import createServer from '../shared/server';
import { WebPath, ports } from '../shared/constants';
import { routes } from './routes';
// import mocks from '../../../tests/mocks';

// const { paperList } = mocks;

const serverConfig: Hapi.ServerOptions | undefined = {
  port: ports.client,
  routes: {
    cors: {
      origin: [WebPath], // allow web requests
      additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
};

(async function start () {
  const server = createServer(serverConfig, routes);

  try {
    // await server.register(Cors);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Client service running at:', server.info.uri);
})();
