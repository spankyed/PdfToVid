// import repository from '../../repository';
import { getDatesBetween } from '../backfill-dates';

async function initializeServer(): Promise<void> {
  const configs = await repository.getConfigs(); // ! repository deleted, use sequalize
  const lastRun = configs[0].lastRun || null;
  const today = new Date().toISOString().split('T')[0];
  console.log('today: ', today);

  console.log('lastRun: ', lastRun);
  if (lastRun) {
    const datesToStore = getDatesBetween(lastRun, today);

    console.log('datesToStore: ', datesToStore); // todo test for overlap

    for (const date of datesToStore) {
      console.log('repository: ', repository);
      const ret1 = await repository.storeDate(date);
      console.log('ret1: ', ret1);
    }
  }

  const ret3 = await repository.updateLastRunDate(today);
  console.log('ret3: ', ret3);

  console.log('Server initialized and dates updated.');
}

export default {
  initializeServer,
}

// setup.initializeServer();
// todo scrape all dates between last run and today
// if last run was today, do nothing
// todo only sync dates up to current date on arxiv
// ? start interval to scrape new papers every 24 hours?