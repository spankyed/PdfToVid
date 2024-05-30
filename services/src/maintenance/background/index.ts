import { getConfig } from "~/shared/utils/get-config";
import { ensureReferenceCollectionExists } from "../scripts/ensure-reference-collection";
// import { scrapeBatch } from "../scripts/scrape-batch";
import { startJobScrapeNewDatesWithRetry } from "../scripts/cron-jobs";
import { backFillAbsentDates } from "../scripts/add-dates";

async function runBackgroundScripts() {
  const config = await getConfig();
  const isNewUser = config.settings.isNewUser;

  if (isNewUser) {
    return;
  }

  ensureReferenceCollectionExists();


  // todo
  // await backFillAbsentDates(config.settings.lastDateChecked);

  startJobScrapeNewDatesWithRetry();

  console.log('Background scripts running.');
}

export default runBackgroundScripts
