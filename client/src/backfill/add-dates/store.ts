import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { datesRowsAtom, openMonthAtom } from '~/shared/components/layout/sidebar/dates/store';
import { selectedDateAtom } from '~/shared/store';

export const backfillStateAtom = atom<'pending' | 'loading'>('pending');

export const addDatesAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    set(backfillStateAtom, 'loading');
    try {
      const response = await api.backfillDates(date);
      const { records, newCount } = response.data;
      console.log('Backfilled: ', { records, newCount });

      set(datesRowsAtom, records);
      // set(selectedDateAtom, records[0]?.dates[0]?.value ?? '');
      set(openMonthAtom, records[0]?.month ?? '');

      set(backfillStateAtom, 'pending');

      // const hasDates = records.length > 0;
    } catch (error) {
      console.error("Failed to backfill data", error);
      // set(calendarStateAtom, 'error');
    }
  }
);

