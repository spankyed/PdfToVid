import Hapi from '@hapi/hapi';
import { getLastFiveDaysOfCurrentMonth, getPapersForDays, getStoredDates, groupByMonth, initializeServer, wipeAllDatastores } from './utils';
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
const dateList = {
  'July 2023': ['Mon, Jul 01', 'Tue, Jul 02', 'Wed, Jul 03'],
  'August 2023': ['Mon, Aug 01', 'Tue, Aug 02', 'Wed, Aug 03'],
  'September 2023': ['Mon, Sep 01', 'Tue, Sep 02', 'Wed, Sep 03', 'Thu, Sep 04', 'Fri, Sep 05', 'Sat, Sep 06', 'Sun, Sep 07', 'Mon, Sep 08', 'Tue, Sep 09', 'Wed, Sep 10', 'Thu, Sep 11', 'Fri, Sep 12', 'Sat, Sep 13', 'Sun, Sep 14', 'Mon, Sep 15', 'Tue, Sep 16', 'Wed, Sep 17', 'Thu, Sep 18', 'Fri, Sep 19', 'Sat, Sep 20', 'Sun, Sep 21', 'Mon, Sep 22', 'Tue, Sep 23', 'Wed, Sep 24', 'Thu, Sep 25', 'Fri, Sep 26', 'Sat, Sep 27', 'Sun, Sep 28', 'Mon, Sep 29', 'Tue, Sep 30'],
}
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
      const dates = await getStoredDates();
      // const days = ["2021-10-06", "2021-10-07", "2021-10-08"]
      const dateList = groupByMonth(dates.map(doc => doc.dateValue));
      const firstFiveDays = getLastFiveDaysOfCurrentMonth(); // ! potentially out of sync with stored dates
      const paperList = await getPapersForDays(firstFiveDays);
      const dashboardData = { dateList, paperList }

      // todo last 5 days from today instead of current month
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

  // wipeAllDatastores();

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

