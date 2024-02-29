import repository from '../repository';

function getWeekdaysBetween(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: string[] = [];

  while (start < end) {
    const dayOfWeek = start.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) and not Saturday (6)
      days.push(start.toISOString().split('T')[0]);
    }
    start.setDate(start.getDate() + 1);
  }

  return days;
}

async function initializeServer(): Promise<void> {
  const configs = await repository.getConfigs();
  const lastRun = configs[0].lastRun || null;
  const today = new Date().toISOString().split('T')[0];
  console.log('today: ', today);

  console.log('lastRun: ', lastRun);
  if (lastRun) {
    const daysToStore = getWeekdaysBetween(lastRun, today);

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
  getWeekdaysBetween,
  initializeServer,
}

// setup.initializeServer();
// todo scrape all dates between last run and today
// if last run was today, do nothing
// todo only sync dates up to current date on arxiv
// ? start interval to scrape new papers every 24 hours?