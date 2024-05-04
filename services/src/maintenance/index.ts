import createServer from '../shared/server';
import { ports } from '../shared/constants';
import Hapi from '@hapi/hapi';
import runBackgroundScripts from './scripts/background';

import onboardRoutes from './onboard';
import backfillRoutes from './backfill';

const routes = [
  ...onboardRoutes,
  ...backfillRoutes,
];


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

  await runBackgroundScripts()

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
