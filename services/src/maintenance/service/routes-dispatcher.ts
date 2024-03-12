import { backfillToDate } from "./handlers";

const webRoutes = [
  {
    method: 'POST',
    path: '/backfill/{date}',
    handler: backfillToDate
  },
];

export default webRoutes
