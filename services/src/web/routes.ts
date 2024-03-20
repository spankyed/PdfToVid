import { getDateEntry } from './date-entry/controller';
import { getDates, updateStatus } from './sidebar-dates/controller';
import calenderRoutes from './calender/controller';

const clientRoutes = [
  ...calenderRoutes,
  // fetch papers for date
  {
    method: 'GET',
    path: '/papersByDate/{date}',
    handler: getDateEntry
  },
  {
    method: 'GET',
    path: '/getDates',
    handler: getDates
  },
];

const workerRoutes = [
  {
    method: 'POST',
    path: '/work-status/{type}', // todo rename dates/scrape-status-update
    handler: updateStatus
  },
];

export const routes = [
  ...clientRoutes,
  ...workerRoutes,
]
