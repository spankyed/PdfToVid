import createServer from '../shared/server';
import { ports } from '../shared/constants';
import routes from './routes';
import Hapi from '@hapi/hapi';

const serverConfig: Hapi.ServerOptions | undefined = { 
  port: ports.maintenance,
  // routes: {
  //   cors: {
  //     origin: [WebPath], // allow web requests
  //     additionalHeaders: ['cache-control', 'x-requested-with']
  //   }
  // }
};

(async function start () {
  const server = createServer(serverConfig, routes);

  // todo check if chroma is up and running
  // todo check if chroma has the necessary collections, populate a collection with seed ref papers if not

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Maintenance service running at:', server.info.uri);
})();


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
