import calendarRoutes from './calendar/controller';
import paperEntryRoutes from './paper-entry/controller';
import dateEntryRoutes from './date-entry/controller';
import sharedRoutes from './shared/controller';

const clientRoutes = [
  ...calendarRoutes,
  ...dateEntryRoutes,
  ...paperEntryRoutes,
  ...sharedRoutes,
];

export const routes = [
  ...clientRoutes,
]
