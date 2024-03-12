import repository from '../repository';
import { getDaysBetween } from './backfill';

async function initializeServer(): Promise<void> {
  const configs = await repository.getConfigs(); // ! repository deleted, use sequalize
  const lastRun = configs[0].lastRun || null;
  const today = new Date().toISOString().split('T')[0];
  console.log('today: ', today);

  console.log('lastRun: ', lastRun);
  if (lastRun) {
    const daysToStore = getDaysBetween(lastRun, today);

    console.log('daysToStore: ', daysToStore); // todo test for overlap

    for (const day of daysToStore) {
      console.log('repository: ', repository);
      const ret1 = await repository.storeDay(day);
      console.log('ret1: ', ret1);
    }
  } else {
    const ret2 = await repository.storeDay(today);
    console.log('ret2: ', ret2);
  }

  const ret3 = await repository.updateLastRunDay(today);
  console.log('ret3: ', ret3);

  console.log('Server initialized and days updated.');
}

export default {
  initializeServer,
}

// setup.initializeServer();
// todo scrape all dates between last run and today
// if last run was today, do nothing
// todo only sync dates up to current date on arxiv
// ? start interval to scrape new papers every 24 hours?