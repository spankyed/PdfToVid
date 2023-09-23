import { postDispatcher as db } from '../endpoints/database/store';
import setup from '../endpoints/worker/service/setup';

export async function backfillDays (date: string): Promise<void> {
  const today = new Date();
  const startDay = new Date(date);

  // Get dates between input date and today
  const daysToBackfill = setup.getWeekdaysBetween(startDay.toISOString().split('T')[0], today.toISOString().split('T')[0]);

  for (const date of daysToBackfill) {
    await db.create({ 
      table: 'days', 
      record: {
        value: date,
        status: 'pending'
      } 
    })();
  }

  console.log('Backfill completed.');
};

// May 1, 2023
backfillDays('2023-05-01'); // ! change this to like a week ago and create beginner friendly script
