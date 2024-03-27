import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { DatesList } from '~/shared/utils/types';

export const datesListAtom = atom<DatesList[]>([]);
export const openMonthAtom = atom('');
export const lastOpenMonthAtom = atom('');


export const fetchDatesSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(calendarStateAtom, 'loading');
    try {
      const response = await api.getDatesSidebarData();
      const dateList = response.data;
      console.log('Sidebar dates:', {dateList});
      set(datesListAtom, dateList);
      set(openMonthAtom, dateList[0]?.month ?? '');

      // set(calendarStateAtom, dateList.length > 0 ? 'ready' : 'backfill')
      // set(calendarStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calendar", error);
      // set(calendarStateAtom, 'error');
    }
  }
);
