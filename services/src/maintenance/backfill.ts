import { DateTable } from '../shared/schema';

// May 1, 2023
backfillDays('2023-05-01');


async function backfillDays (date: string): Promise<void> {
  const today = new Date();
  const startDay = new Date(date);

  // Get dates between input date and today
  const daysToBackfill = getWeekdaysBetween(startDay.toISOString().split('T')[0], today.toISOString().split('T')[0]);

  for (const day of daysToBackfill) {
    await DateTable.findOrCreate({
      where: { value: day },
      defaults: {
        status: 'pending'
      }
    });
  }

  console.log('Backfill completed.');
};

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