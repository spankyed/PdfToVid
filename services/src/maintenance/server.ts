import createServer from '../shared/server';
import { ports } from '../shared/constants';
import Hapi from '@hapi/hapi';
import runBackgroundScripts from './background';
import routes from './endpoints';

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

  try {
    await server.start();

    console.log('Maintenance service running at:', server.info.uri);

    await runBackgroundScripts()
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
})();


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
