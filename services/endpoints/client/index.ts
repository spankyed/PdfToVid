import type Hapi from '@hapi/hapi';
import { groupDaysByMonth } from './functions';
import createServer from '../shared/server';
import repository from './repository';
import { worker } from './integrations';
import { WebPath, ports } from '../shared/constants';
import mocks from '../../../tests/mocks';

const serverConfig: Hapi.ServerOptions | undefined = {
  port: ports.client,
  routes: {
    cors: {
      origin: [WebPath], // allow web requests
      additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
};

const routes = [
  {
    method: 'GET',
    path: '/dashboard',
    handler: (request, h) => {
      return new Promise(async (resolve, reject) => {
        const [allDays, fiveRecentDays] = await repository.fetchDashboard();
        // ["2021-10-06", "2021-10-07", "2021-10-08"]
        const dateList = groupDaysByMonth(allDays);
        // const paperList = await getPapersForDays(fiveRecentDays.map(date => date.value), 0, 7);
  
        // todo current day seems to be off (13th instead of 14th for today)
        const dashboardData = { dateList, paperList }
        
        resolve(dashboardData)
      });
    }
  },
  {
    method: 'POST',
    path: '/scrape',
    handler: async (request, h) => {
      console.log('request.params.payload: ', request.params.payload);
      const result = await worker.scrape({ date: request.params.payload });
      return result;
    }
  }
];

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
