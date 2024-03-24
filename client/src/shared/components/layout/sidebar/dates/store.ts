import { atom } from 'jotai';
import { hasDatesAtom } from '~/calender/components/backfill/store';
import { calenderModelAtom, rowCountUpdatedAtom } from '~/calender/components/main/store';
import * as api from '~/shared/api/fetch';
import { CalenderModel, DatesList } from '~/shared/utils/types';

export const datesListAtom = atom<DatesList[]>([]);
export const openMonthAtom = atom<string>('');
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
      // set(hasDatesAtom, dateList.length > 0); // ! new user state for calender store
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
    try {
      console.log('calenderLoadMonthAtom: ');

      // set(calenderStateAtom, 'loading');
      const response = await api.calenderLoadMonth(date);
      const calenderModel = response.data as CalenderModel;
      console.log('load month: ', calenderModel);
      console.log('month.length: ', calenderModel.length);
      set(calenderModelAtom, calenderModel);
      set(rowCountUpdatedAtom, true);
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
    } catch (error) {
      console.error("Failed to load more calender dates", error);
      // set(calenderStateAtom, 'error');
    }
  }
);