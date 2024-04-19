import scrapeAndRankPapers from '~/worker/controllers/scrape';
import { doesReferenceCollectionExist, seedReferencePapers } from '../seed-reference-papers';
import { getConfig } from '~/shared/utils/get-config';
import repository from '~/maintenance/repository';
import { cronScrapeTodayWithRetry, cronAddTodaysDate } from '../cron-jobs';
import { backfillDates } from '../../add-dates';


async function doDailyOperations() {
  const collectionExists = await doesReferenceCollectionExist();

  if (!collectionExists) {
    const referencePapers = await repository.getReferencePapers();
    console.log('referencePapers: ', referencePapers);
    await seedReferencePapers(referencePapers); // paranoid seeding
  }

  const config = getConfig();
  // const autoAddNewDates = config.settings.autoAddNewDates;
  // const autoScrapeNewDates = config.settings.autoScrapeNewDates;
  const autoAddNewDates = false;
  const autoScrapeNewDates = false;

  if (!autoAddNewDates) {
    return;
  }

  const startDate = await repository.getLatestDate();

  if (!startDate) {
    // todo reset config to onboarding state
    return;
  }

  const datesToScrape = await backfillDates(startDate, new Date());

  if (autoScrapeNewDates) {
    console.log('Auto Scraping New Dates: ');
    if (datesToScrape.length > 0) {
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
