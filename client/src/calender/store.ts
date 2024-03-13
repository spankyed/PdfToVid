import { atom } from 'jotai';
import * as api from '../shared/api/fetch';
import { datesListAtom, papersListAtom, selectedDayAtom, openMonthAtom } from '../shared/store';

export const hasDatesAtom = atom<boolean>(true); // assumed to be true by default, but can be set to false if there are no dates after fetching

export const backFillFetchAtom = atom(
  null, // write-only atom
  async (get, set, date) => { // 'date' argument is the formatted date string e.g., '2023-05-01'
    // Optionally set a state atom to 'loading' before the operation starts
    // set(calenderStateAtom, 'loading');
    try {
      const response = await api.backfillToDate(date); // Assuming 'date' is passed correctly to your API method
      const { dateList, paperList } = response.data;
      console.log('Backfilled dateList: ', dateList);
      console.log('Backfilled paperList: ', paperList);
      // Update your state atoms with the new data
      set(datesListAtom, dateList);
      set(papersListAtom, paperList);
      // Update any other relevant state atoms as needed
      set(selectedDayAtom, dateList[0]?.days[0]?.value ?? '');
      set(openMonthAtom, dateList[0]?.month ?? '');
      set(hasDatesAtom, dateList.length > 0); // ! move loading state to papers store

      // Optionally set a state atom to a success state after the operation
      // set(calenderStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to backfill data", error);
      // Optionally set a state atom to an error state after catching an error
      // set(calenderStateAtom, 'error');
    }
  }
);
