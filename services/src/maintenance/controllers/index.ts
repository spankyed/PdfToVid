import onboardRoutes from './onboard';
import backfillRoutes from './backfill-dates';
import batchScrapeRoutes from './batch-scrape';

export const routes = [
  ...onboardRoutes,
  ...backfillRoutes,
  ...batchScrapeRoutes,
];
