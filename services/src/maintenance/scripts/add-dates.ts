import repository from '../repository';
import { setConfigSettings } from '~/shared/utils/set-config';
import { Config } from '~/shared/utils/get-config';

// usage: backfill from current date to May 1, 2023
// backfillDates('2023-05-01');

type DateParam = string | Date;

// ? Returns either an interface including  all records or only a list of new date values
export async function backfillDates(startDate: DateParam, endDate?: DateParam) {
  const to = endDate || new Date();
  const from = new Date(startDate);
  const datesToBackfill = getDatesBetween(from, to);
  const newRecords = await repository.storeDates(datesToBackfill);

  console.log('Backfill completed.');

  return newRecords;
};

export async function backFillAbsentDates(lastDateChecked: Config['settings']['lastDateChecked']) {
  const lastDateAdded = await repository.getLatestDate();
  const today = getCurrentDate();

  if (!lastDateAdded) {
    setConfigSettings({ isNewUser: true });

    return;
  } 

  if (lastDateAdded > today || lastDateAdded === today) {
    return;
  }

  const startDate = lastDateChecked  ? lastDateChecked : lastDateAdded;
  const dateRecords = await backfillDates(startDate, new Date());

  return dateRecords.map(dateRecord => dateRecord.value);
}


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

// export function getDateNDaysBack(n: string) {
//   const date = new Date();
//   const pastDate = new Date(date.setDate(date.getDate() - Number(n)));
//   return new Date(pastDate.setHours(0, 0, 0, 0)).toISOString().split('T')[0];
// }
