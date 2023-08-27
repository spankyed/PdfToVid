import type Hapi from '@hapi/hapi';
import { groupDaysByMonth, mapPapersToDays } from './functions';
import createServer from '../shared/server';
import repository from './repository';
import { worker, status } from './integrations';
import { WebPath, ports } from '../shared/constants';
import mocks from '../../../tests/mocks';

const { paperList } = mocks;

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
        const [allDays, lastFiveDays] = await repository.fetchDashboard();
        const papers = await repository.getPapersForDays(lastFiveDays, 0, 7);
        const paperList = mapPapersToDays(lastFiveDays, papers);
        const dateList = groupDaysByMonth(allDays);
        // ! ensure paperList only includes dates in DB
        
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
      console.log('scrape req ', request.payload);
      // console.log('request.params.payload: ', request.data);
      // const workerResponse = await worker.scrape({ date: request.params.payload });
      return { status: 'scraping' };

      if (!workerResponse){
        return { error: 'Problem scraping papers' }
      }

      return workerResponse;
    }
  },
  {
    method: 'POST',
    path: '/check-status',
    handler: async (request, h) => {
      // console.log('request ', request);
      console.log('status req ', request.payload);
      const workerResponse = await status.check(request.payload);
      console.log('workerResponse: ', workerResponse);

      if (!workerResponse){
        return { error: 'Problem scraping papers' }
      }

      return workerResponse;
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
