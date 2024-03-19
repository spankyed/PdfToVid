import { initialBackfill, getCalender, scrapePapers } from '../calender/controller';
import { getDateEntry } from '../date-entry/controller';
import { getDates, updateStatus } from './dates/controller';

const clientRoutes = [
  {
    method: 'GET',
    path: '/getCalender', // rename getCalender
    handler: getCalender
  },
  {
    method: 'POST',
    path: '/scrape/{date}',
    handler: scrapePapers
  },
  {
    method: 'POST',
    path: '/backfill/{date}',
    handler: initialBackfill
  },
  // fetch papers for day
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
  ...workerRoutes
]
