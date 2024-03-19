import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { selectedDayAtom } from '~/shared/store';
import { PapersList } from '~/shared/utils/types';
import { hasDatesAtom } from '../backfill/store';

export const papersListAtom = atom<PapersList[]>([]);
export const fetchCalenderGridDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(calenderStateAtom, 'loading');
    try {
      const response = await api.getCalenderGridData();
      const { dateList, paperList } = response.data;
      console.log('paperList: ', paperList);
      set(papersListAtom, paperList);
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

