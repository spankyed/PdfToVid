import { getDates, updateStatus } from './sidebar-dates/controller';
import calendarRoutes from './calendar/controller';
import paperEntryRoutes from './paper-entry/controller';
import dateEntryRoutes from './date-entry/controller';

const clientRoutes = [
  ...calendarRoutes,
  ...dateEntryRoutes,
  ...paperEntryRoutes,
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
