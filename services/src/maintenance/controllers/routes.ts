import { backfillToDate } from "./backfill";

const webRoutes = [
  {
    method: 'POST',
    path: '/backfill/{date}',
    handler: backfillToDate
  },
];

export default webRoutes
