import repository from '../repository';

// usage: backfill from current date to May 1, 2023
// backfillDates('2023-05-01');

type DateParam = string | Date;


// ? Returns either an interface including interface all records or only a list of new date values
export async function backfillDates(startDate: DateParam, endDate?: DateParam, returnAllRecords = false): Promise<any> {
  const to = endDate || new Date();
  const from = new Date(startDate);
  const datesToBackfill = getDatesBetween(from, to);

  const dateRecords = returnAllRecords
    ? await repository.getAllDates()
    : await repository.getByDates(datesToBackfill);

  const existingDates = dateRecords.map(record => record.value);
  const newDates = datesToBackfill
    .filter(date => !existingDates.includes(date))
    .filter((date, index, self) => self.indexOf(date) === index) // Filter duplicates

  if (!(newDates.length > 0)) {
    return returnAllRecords ? {
      records: dateRecords,
      newCount: 0
    } : [];
  }

  const newRecords = await repository.storeDates(newDates);

  console.log('Backfill completed.');

  return returnAllRecords ? {
    records: dateRecords.concat(newRecords),
    newCount: newRecords.length
  } : newRecords;
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