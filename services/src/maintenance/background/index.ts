import { getConfig } from "~/shared/utils/get-config";
import { ensureReferenceCollectionExists } from "../scripts/ensure-reference-collection";
import { scrapeBatch } from "../scripts/scrape-batch";
import { startJobAddNewDates, startJobScrapeNewDatesWithRetry } from "../scripts/cron-jobs";
import { backFillAbsentDates } from "../scripts/add-dates";

async function runBackgroundScripts(skipToday = false) {
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

  // await scrapeBatch(absentDates, false);

  startJobScrapeNewDatesWithRetry(skipToday);

  console.log('Background scripts running.');
}

export default runBackgroundScripts
