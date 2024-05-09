import cron from 'node-cron';
import scrapeAndRankPapers from '~/worker/controllers/scrape';
import repository from '~/maintenance/repository';
import { getCurrentDate } from './add-dates';

type Jobs = { [key: string]: cron.ScheduledTask };
const scrapeJobs: Jobs = {};

export async function startJobAddNewDates() {
  const date = getCurrentDate();
  await repository.storeDate(date)

  return cron.schedule('0 0 * * *', async () => {
    const date = getCurrentDate();

    console.log(`Adding new date, ${date}`);

    await repository.storeDate(date);
  });
}

export async function startJobScrapeNewDatesWithRetry() {
  scrapeTodayWithRetry(true);

  return cron.schedule('0 0 * * *', async () => {
    // runs at midnight every day
    scrapeTodayWithRetry();
  })
}

async function scrapeTodayWithRetry(tryNow = false) {
  const date = getCurrentDate();
  await repository.storeDate(date)

  if (tryNow) {
    attemptToScrapeTodaysPapers(date)
  }

  if (scrapeJobs[date]) {
    return;
  }

  let attempts = 0;

  scrapeJobs[date] = cron.schedule('0 */6 * * *', async () => {
    attempts++;

    console.log(`Attempt [${attempts}] to scrape papers for date, ${date}...`);

    attemptToScrapeTodaysPapers(date)
  });
}

async function attemptToScrapeTodaysPapers(date: any) {
  const dateRecord = await repository.getDate(date) 
  const isPending = dateRecord?.status === 'pending';
  const result = isPending ? await scrapeAndRankPapers(date) : [];

  if (scrapeJobs[date] && (result.length || !isPending)) {
    scrapeJobs[date].stop();
    delete scrapeJobs[date];
  }
};
