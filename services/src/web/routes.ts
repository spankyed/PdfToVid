import calendarRoutes from './calendar/controller';
import paperEntryRoutes from './paper-entry/controller';
import dateEntryRoutes from './date-entry/controller';
import sharedRoutes from './shared/controller';

export const routes = [
  ...calendarRoutes,
  ...dateEntryRoutes,
  ...paperEntryRoutes,
  ...sharedRoutes,
];
