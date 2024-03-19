import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { selectedDayAtom } from '~/shared/store';
import { CalenderModel } from '~/shared/utils/types';
import { hasDatesAtom } from '../backfill/store';

export const calenderModelAtom = atom<CalenderModel>([]);
export const fetchCalenderGridDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(calenderStateAtom, 'loading');
    try {
      const response = await api.getCalenderModelData();
      const { dateList, calenderModel } = response.data;
      // const calenderModel = response.data;
      console.log('calenderModel: ', calenderModel);
      set(calenderModelAtom, calenderModel);
      // set(calenderModelAtom, calenderModel);
      // set(selectedDayAtom, dateList[0]?.days[0]?.value ?? '');

      console.log('dateList.length: ', dateList.length);
      set(hasDatesAtom, dateList.length > 0); // ! move loading state to papers store
      
      // set(calenderStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calender", error);
      // set(calenderStateAtom, 'error');
    }
  }
);

