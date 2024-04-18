import scrapeAndRankPapers from '~/worker/controllers/scrape';
import { doesReferenceCollectionExist, seedReferencePapers } from '../seed-reference-papers';
import { getConfig } from '~/shared/utils/get-config';
import repository from '~/maintenance/repository';
import { cronScrapeTodayWithRetry, cronAddTodaysDate } from '../cron-jobs';
import { backfillDates } from '../../add-dates';


async function doDailyOperations() {
  const collectionExists = await doesReferenceCollectionExist();

  if (!collectionExists) {
    // todo only scrape if no reference papers exist in DB
    // otherwise pass references in DB
    // const referencePapers = await repository.getReferencePapers();
    const referencePapers: any[] = [];
    await seedReferencePapers(referencePapers);
  }

  const config = getConfig();
  const autoScrapeNewDates = false;
  // const autoScrapeNewDates = config.settings.autoScrapeNewDates;
  const autoAddNewDates = false;
  // const autoAddNewDates = config.settings.autoAddNewDates;

  if (!autoAddNewDates) {
    return;
  }

  const startDate = await repository.getLatestDate();

  if (!startDate) {
    // todo reset config to onboarding state
    return;
  }

  const datesToScrape: any[] = await backfillDates(startDate, new Date());

  if (autoScrapeNewDates) {
    console.log('Auto Scraping New Dates: ');
    if (datesToScrape) {
      Promise.all(datesToScrape.map(dateRecord => scrapeAndRankPapers(dateRecord.value, false)))
    }
    // check if new papers are available every 2 hours for current date
    // cronScrapeTodayWithRetry();
    // (await cronScrapeTodayWithRetry()).start()
  } else {
    // else add new date record every 24 hours
    cronAddTodaysDate()
  }

  console.log('Maintenance server initialized and dates updated.');
}




export default doDailyOperations
