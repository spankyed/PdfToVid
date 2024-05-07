import { getConfig } from "~/shared/utils/get-config";
import { ensureReferenceCollectionExists } from "./utils/ensure-reference-collection";
import { backFillAbsentDates } from "./utils/backfill-absent-dates";
import { scrapeBatch } from "../scrape-batch";
import { startJobAddNewDates, startJobScrapeNewDatesWithRetry } from "./utils/cron-jobs";

async function runBackgroundScripts() {
  console.log('Running maintenance server background scripts...');

  const config = await getConfig();
  const isNewUser = config.settings.isNewUser;

  if (isNewUser) {
    return;
  }

  ensureReferenceCollectionExists();

  if (!config.settings.autoAddNewDates) {
    return;
  }

  const absentDates = await backFillAbsentDates(config.settings.maxBackfill);

  if (!config.settings.autoScrapeNewDates) {
    startJobAddNewDates()

    return;
  }

  await scrapeBatch(absentDates, false);

  startJobScrapeNewDatesWithRetry();

  console.log('Background scripts running.');
}


export default runBackgroundScripts
