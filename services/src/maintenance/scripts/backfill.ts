import { DateTable } from '../../shared/schema';

// usage: backfill from current date to May 1, 2023
// backfillDays('2023-05-01');

export async function backfillDays(date: string): Promise<any> {
  const today = new Date();
  const startDay = new Date(date);

  const daysToBackfill = getDaysBetween(startDay.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  console.log('daysToBackfill: ', daysToBackfill);
  const existingDates = await DateTable.findAll({
    where: {
      value: daysToBackfill
    }
  });
  const existingDateValues = existingDates.map(record => record.value);
  const newDates = daysToBackfill.filter(day => !existingDateValues.includes(day));
  const newDateRecords = newDates
    .filter((day, index, self) => self.indexOf(day) === index) // Filter duplicates
    .map(day => ({
      value: day,
      status: 'pending'
    }));

  if (newDateRecords.length > 0) {
    await DateTable.bulkCreate(newDateRecords, {
      ignoreDuplicates: true // This option depends on your DBMS and Sequelize version
    });
  }

  console.log('Backfill completed.');

  // return last 7 days
  return newDateRecords;
};
function getDaysBetween(startDate: string, endDate: string): string[] {
  let start = new Date(startDate);
  const end = new Date(endDate);
  const days: string[] = [];

  // Reset start time to avoid timezone issues
  start = new Date(start.setHours(0, 0, 0, 0));
  const endUTC = new Date(end.setHours(0, 0, 0, 0));

  while (start <= endUTC) {
    days.push(start.toISOString().split('T')[0]);
    start = new Date(start.setDate(start.getDate() + 1));
  }

  return days;
}