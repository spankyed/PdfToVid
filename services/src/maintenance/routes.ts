import { backfillToDate } from "./controllers/backfill";

const webRoutes = [
  {
    method: 'POST',
    path: '/backfill/{date}',
    handler: backfillToDate
  },
];

export default webRoutes
