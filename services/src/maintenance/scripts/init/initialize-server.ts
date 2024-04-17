// import cron from 'node-cron'; // Import node-cron to handle scheduled tasks
import { getLatestDates } from './get-latest-dates';
import scrapeAndRankPapers from '~/worker/controllers/scrape';
import { doesReferenceCollectionExist, seedReferencePapers } from './seed-reference-papers';
import { getConfig } from '~/shared/utils/get-config';
import repository from '~/maintenance/repository';

// todo
// if config.settings.autoscrape is enabled set interval to check if new papers are available every 2 hours
  // example of scraping papers by date: scrapePapersByDate('2024-02-21')
// else start interval to add new date record every 24 hours


async function initializeServer() {
  const config = getConfig();
  const shouldScrapeNewDates = config.settings.autoScrapeNewDates;
  const shouldAddNewDates = config.settings.autoAddNewDates;

  const datesToStore = await getLatestDates();

  if (datesToStore && shouldAddNewDates) {
    await repository.storeDates(datesToStore)
  }

  if (datesToStore && shouldScrapeNewDates) {
    await Promise.all(datesToStore.map(date => scrapeAndRankPapers(date, false)));
  }

  const collectionExists = await doesReferenceCollectionExist();

  if (!collectionExists) {
    await seedReferencePapers();
  }

  console.log('Server initialized and dates updated.');
}

export default initializeServer
