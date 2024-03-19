import { atom } from 'jotai';
import { hasDatesAtom } from '~/calender/components/backfill/store';
import * as api from '~/shared/api/fetch';
import { DatesList } from '~/shared/utils/types';

export const datesListAtom = atom<DatesList[]>([]);
export const openMonthAtom = atom<string>('');
export const fetchDatesSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(calenderStateAtom, 'loading');
    try {
      const response = await api.getDatesSidebarData();
      const dateList = response.data;
      console.log('date component fetch data: ', {dateList});
      console.log('dateList.length: ', dateList.length);
      set(datesListAtom, dateList);
      set(openMonthAtom, dateList[0]?.month ?? '');
      // set(hasDatesAtom, dateList.length > 0); // ! new user state for calender store
      // set(calenderStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calender", error);
      // set(calenderStateAtom, 'error');
    }
  }
);
