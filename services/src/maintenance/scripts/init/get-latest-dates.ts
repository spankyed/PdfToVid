import { getDatesBetween } from '../backfill-dates';
import repository from '~/maintenance/repository';

export async function getLatestDates() {
  const lastDateRecord = await repository.getLatestDate();
  const lastDate = lastDateRecord ? lastDateRecord.value : null;

  if (!lastDate) {
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const datesToStore = getDatesBetween(lastDate, today);

  return datesToStore;
}