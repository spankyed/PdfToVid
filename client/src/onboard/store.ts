import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import type dayjs from 'dayjs'; // Import dayjs if you haven't already


export const canGoNextAtom = atom(true);
export const inputIdsAtom = atom<string[]>([]);




type Day = dayjs.Dayjs | null;

export const backFillFetchAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    set(calendarStateAtom, 'loading');
    try {
      const response = await api.backfillToDate(date);
      const { dateList, calendarModel } = response.data;
      console.log('Backfilled: ', { dateList, calendarModel });

      set(datesRowsAtom, dateList);
      set(openMonthAtom, dateList[0]?.month ?? '');

      // const hasDates = dateList.length > 0;
    } catch (error) {
      console.error("Failed to backfill data", error);
      // set(calendarStateAtom, 'error');
    }
  }
);