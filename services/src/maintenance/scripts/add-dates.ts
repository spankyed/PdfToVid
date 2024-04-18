import repository from '../repository';

// usage: backfill from current date to May 1, 2023
// backfillDates('2023-05-01');

type DateParam = string | Date;

export async function backfillDates(startDate: DateParam, endDate?: DateParam): Promise<any[]> {
  const to = endDate || new Date();
  const from = new Date(startDate);
  const datesToBackfill = getDatesBetween(from, to);

  const dateRecords = await repository.getByDates(datesToBackfill);

  const existingDates = dateRecords.map(record => record.value);
  const newDateRecords = datesToBackfill
    .filter(date => !existingDates.includes(date))
    .filter((date, index, self) => self.indexOf(date) === index) // Filter duplicates

  if (newDateRecords.length > 0) {
    return await repository.storeDates(newDateRecords);
  }

  console.log('Backfill completed.');

  return newDateRecords;
};

export function getDatesBetween(startDate: DateParam, endDate: DateParam): string[] {
  const dates: string[] = [];
  const to = new Date(endDate);
  let from = new Date(startDate);

  // Reset from time to avoid timezone issues
  // ! revisit this logic for handling timezones
  from = new Date(from.setHours(0, 0, 0, 0));
  const endUTC = new Date(to.setHours(0, 0, 0, 0));

  while (from <= endUTC) {
    dates.push(from.toISOString().split('T')[0]);
    const nextDate = new Date(from.setDate(from.getDate() + 1))
    from = nextDate;
  }

  return dates;
}

export function getCurrentDate() {
  const date = new Date();
  return new Date(date.setHours(0, 0, 0, 0)).toISOString().split('T')[0];
}