import Hapi from '@hapi/hapi';
import { getFiveMostRecentDays, getPapersForDays, getStoredDays, groupDaysByMonth, initializeServer } from './utils';
import mocks from '../../../tests/mocks';
const { paperList } = mocks;

// import Cors from '@hapi/cors';

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['http://localhost:5173'], // your allowed origin
      additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
});

server.route({
  method: 'GET',
  path: '/dashboard',
  handler: (request, h) => {
    return new Promise(async (resolve, reject) => {
      const [allDays, recentDays] = await Promise.all([
        getStoredDays(), 
        getFiveMostRecentDays()
      ]);
      // ["2021-10-06", "2021-10-07", "2021-10-08"]
      const dateList = groupDaysByMonth(allDays);
      // todo replace papers below with videos for days
      // const paperList = await getPapersForDays(recentDays.map(date => date.value), 0, 7);

      // todo current day seems to be off (13th instead of 14th for today)
      const dashboardData = { dateList, paperList }
      
      resolve(dashboardData)
    });
  }
});

server.route({
  method: 'GET',
  path: '/scrape/{date}',
  handler: (request, h) => {
    return new Promise((resolve, reject) => {
      console.log('request.params.date: ', request.params.date);
      // h.response('Hello World');
      resolve('Hello World')
    });
  }
});

const startServer = async () => {
  initializeServer();
  // todo only sync dates up to current date on arxiv

  try {
    // await server.register(Cors);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

startServer();

// todo scrape all dates between last run and today
