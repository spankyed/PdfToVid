import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { datesRowsAtom, openMonthAtom } from '~/shared/components/layout/sidebar/dates/store';
import { selectedDateAtom } from '~/shared/store';
import { calendarModelAtomBase, calendarStateAtom } from '../../store';

export const backFillFetchAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    set(calendarStateAtom, 'loading');
    try {
      const response = await api.backfillToDate(date);
      const { dateList, calendarModel } = response.data;
      console.log('Backfilled: ', { dateList, calendarModel });

      set(datesRowsAtom, dateList);
      set(calendarModelAtomBase, calendarModel); // Update the base atom directly
      set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      set(openMonthAtom, dateList[0]?.month ?? '');

      const hasDates = dateList.length > 0;
      set(calendarStateAtom, hasDates ? 'ready' : 'backfill');
    } catch (error) {
      console.error("Failed to backfill data", error);
      // set(calendarStateAtom, 'error');
    }
  }
);

