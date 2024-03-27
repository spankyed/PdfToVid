import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { datesListAtom, openMonthAtom } from '~/shared/components/layout/sidebar/dates/store';
import { selectedDateAtom } from '~/shared/store';
import { calendarModelAtom, calendarStateAtom } from '../main/store';

export const backFillFetchAtom = atom(
  null, // write-only atom
  async (get, set, date) => { // 'date' argument is the formatted date string e.g., '2023-05-01'
    set(calendarStateAtom, 'loading');
    try {
      const response = await api.backfillToDate(date); // Assuming 'date' is passed correctly to your API method
      const { dateList, calendarModel } = response.data;
      console.log('Backfilled: ', { dateList, calendarModel });
      // Update your state atoms with the new data
      set(datesListAtom, dateList);
      set(calendarModelAtom, calendarModel);
      // Update any other relevant state atoms as needed
      set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      set(openMonthAtom, dateList[0]?.month ?? '');

      const hasDates = dateList.length > 0;
      set(calendarStateAtom, hasDates ? 'ready' : 'backfill')
      // set(calendarStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to backfill data", error);
      // Optionally set a state atom to an error state after catching an error
      // set(calendarStateAtom, 'error');
    }
  }
);
