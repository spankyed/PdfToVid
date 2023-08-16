import Hapi from '@hapi/hapi';
import { getFiveMostRecentDays, getPapersForDays, getStoredDays, groupDaysByMonth, initializeServer } from './utils';
// import Cors from '@hapi/cors';

// Initialize Hapi server
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

// dashboard data mockup
const dateList = [{
  month: 'July 2023',
  days: [ { value: 'Mon, Jul 01', hasBeenScraped: false }, { value: 'Mon, Jul 01', hasBeenScraped: false }]
}]
const dashboardData = {
  // initialPapersCount: 5,
  dateList,
  papersByDay: {
    "2021-10-04": [],
    "2021-10-05": [
      {
        id: '1',
        imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
      },
      {
        id: '1',
        imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
      },
    ],
  },
}

server.route({
  method: 'GET',
  path: '/dashboard',
  handler: (request, h) => {
    return new Promise(async (resolve, reject) => {
      const [allDays, recentDays] = await Promise.all([getStoredDays(), getFiveMostRecentDays()]);
      // ["2021-10-06", "2021-10-07", "2021-10-08"]
      const dateList = groupDaysByMonth(allDays);
      // todo replace papers below with videos for days
      const paperList = await getPapersForDays(recentDays.map(date => date.value), 0, 7);
      const dashboardData = { dateList, paperList }

      // todo current day seems to be off (13th instead of 14th for today)
      
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
