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

  if (lastRun) {
    const daysToStore = getWeekdaysBetween(lastRun, today);

    console.log('daysToStore: ', daysToStore); // todo test for overlap

    for (const day of daysToStore) {
      await repository.storeDay(day);
    }
  } else {
    await repository.storeDay(today);
  }

  await repository.updateLastRunDay(today);

  console.log('Server initialized and days updated.');
}

export default {
  getWeekdaysBetween,
  initializeServer,
}
