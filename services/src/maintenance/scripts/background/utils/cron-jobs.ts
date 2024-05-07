import cron from 'node-cron';
import scrapeAndRankPapers from '~/worker/controllers/scrape';
import repository from '~/maintenance/repository';
import { getCurrentDate } from '../../add-dates';

type Jobs = { [key: string]: any };
const scrapeJobs: Jobs = {};

async function attemptToScrapeTodaysPapers(date: string) {
  const result = await scrapeAndRankPapers(date);

  if (result) {
    scrapeJobs[date].destroy();
    delete scrapeJobs[date];
  }
};

export function startJobScrapeNewDatesWithRetry(){
  return cron.schedule('0 0 * * *', async () => { // runs at midnight every day
    const date = getCurrentDate();
    await repository.storeDate(date)

    let attempts = 0;

    scrapeJobs[date] = cron.schedule('0 */6 * * *', async () => {
      attempts++;

      console.log(`Attempt [${attempts}] to scrape papers for date, ${date}...`);

      attemptToScrapeTodaysPapers(date)
    });
  })
}

export async function startJobAddNewDates() {
  return cron.schedule('0 0 * * *', async () => {
    const date = getCurrentDate();

    console.log(`Adding new date, ${date}`);

    await repository.storeDate(date);
  });
}
