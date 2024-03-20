import { DateTable } from '../../shared/schema';

// usage: backfill from current date to May 1, 2023
// backfillDates('2023-05-01');

export async function backfillDates(date: string): Promise<any> {
  const today = new Date();
  const startDate = new Date(date);

  const datesToBackfill = getDatesBetween(startDate.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  console.log('datesToBackfill: ', datesToBackfill);
  const existingDates = await DateTable.findAll({
    where: {
      value: datesToBackfill
    }
  });
  const existingDateValues = existingDates.map(record => record.value);
  const newDates = datesToBackfill.filter(date => !existingDateValues.includes(date));
  const newDateRecords = newDates
    .filter((date, index, self) => self.indexOf(date) === index) // Filter duplicates
    .map(date => ({
      value: date,
      status: 'pending'
    }));

  if (newDateRecords.length > 0) {
    await DateTable.bulkCreate(newDateRecords, {
      ignoreDuplicates: true // This option depends on your DBMS and Sequelize version
    });
  }

  console.log('Backfill completed.');

  // return last 7 dates
  return newDateRecords;
};
export function getDatesBetween(startDate: string, endDate: string): string[] {
  let start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  // Reset start time to avoid timezone issues
  start = new Date(start.setHours(0, 0, 0, 0));
  const endUTC = new Date(end.setHours(0, 0, 0, 0));

  while (start <= endUTC) {
    dates.push(start.toISOString().split('T')[0]);
    start = new Date(start.setDate(start.getDate() + 1));
  }

  return dates;
}