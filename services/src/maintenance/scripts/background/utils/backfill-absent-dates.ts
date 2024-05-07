import { Config } from '~/shared/utils/get-config';
import repository from '~/maintenance/repository';
import { backfillDates, getCurrentDate, getDateNDaysBack } from '../../add-dates';
import { setConfig } from '~/shared/utils/set-config';

export async function backFillAbsentDates(maxBackfill: Config['settings']['maxBackfill']) {
  const lastDateAdded = await repository.getLatestDate();
  const today = getCurrentDate();

  if (!lastDateAdded) {
    setConfig({ settings: { isNewUser: true }});

    return;
  } 

  if (lastDateAdded > today || lastDateAdded === today) {
    return;
  }

  const dateBackNDays = getDateNDaysBack(maxBackfill!)

  const startDate = lastDateAdded < dateBackNDays ? dateBackNDays : lastDateAdded;

  const dateRecords = await backfillDates(startDate, new Date());

  return dateRecords.map(dateRecord => dateRecord.value);
}
