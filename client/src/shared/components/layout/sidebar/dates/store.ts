import { atom } from 'jotai';
import { calenderModelAtom, calenderStateAtom, rowCountUpdatedAtom } from '~/calender/components/main/store';
import * as api from '~/shared/api/fetch';
import { CalenderModel, DatesList } from '~/shared/utils/types';

export const datesListAtom = atom<DatesList[]>([]);
export const openMonthAtom = atom(
  '',
  (get, set, openMonth: string) => {
    const lastOpenMonth = get(openMonthAtom);
    if (lastOpenMonth !== '') {
      set(lastOpenMonthAtom, lastOpenMonth);
    }
    set(openMonthAtom, openMonth);
  }
);
export const lastOpenMonthAtom = atom('');


export const fetchDatesSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(calenderStateAtom, 'loading');
    try {
      const response = await api.getDatesSidebarData();
      const dateList = response.data;
      console.log('Sidebar dates:', {dateList});
      set(datesListAtom, dateList);
      set(openMonthAtom, dateList[0]?.month ?? '');

      // set(calenderStateAtom, dateList.length > 0 ? 'ready' : 'backfill')
      // set(calenderStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calender", error);
      // set(calenderStateAtom, 'error');
    }
  }
);

export const calenderLoadMonthAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    // set(calenderStateAtom, 'loading');
    try {
      const response = await api.calenderLoadMonth(date);
      const calenderModel = response.data as CalenderModel;
      set(calenderModelAtom, calenderModel);
      set(rowCountUpdatedAtom, true);
      // set(calenderStateAtom, 'ready');
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
    } catch (error) {
      console.error("Failed to load more calender dates", error);
      set(calenderStateAtom, 'error');
    }
  }
);