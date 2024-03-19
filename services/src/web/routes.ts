import { initialBackfill, getCalender, scrapePapers } from './calender/controller';
import { getDateEntry } from './date-entry/controller';
import { updateStatus } from './shared/controllers/worker';

const clientRoutes = [
  {
    method: 'GET',
    path: '/calender',
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
];

const workerRoutes = [
  {
    method: 'POST',
    path: '/work-status/{type}', // todo rename status update
    handler: updateStatus
  },
];

export const routes = [
  ...clientRoutes,
  ...workerRoutes
]
