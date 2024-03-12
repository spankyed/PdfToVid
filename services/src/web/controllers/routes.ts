import { backfill, getCalender, getPapersForDay, scrapePapers } from './web';
import { updateStatus } from './worker';

const workerRoutes = [
  {
    method: 'POST',
    path: '/work-status/{type}',
    handler: updateStatus
  },
];

const clientRoutes = [
  {
    method: 'GET',
    path: '/calender',
    handler: getCalender
  },
  // fetch papers for day
  {
    method: 'GET',
    path: '/papers/{date}',
    handler: getPapersForDay
  },
  {
    method: 'POST',
    path: '/scrape/{date}',
    handler: scrapePapers
  },
  {
    method: 'POST',
    path: '/backfill/{date}',
    handler: backfill
  },
];

export const routes = [
  ...clientRoutes,
  ...workerRoutes
]
