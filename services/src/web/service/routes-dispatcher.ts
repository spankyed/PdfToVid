import { backfill, getDashboard, getPapersForDay, scrapePapers } from './handlers/http-client';
import { updateStatus } from './handlers/http-status';

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
    path: '/dashboard',
    handler: getDashboard
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
