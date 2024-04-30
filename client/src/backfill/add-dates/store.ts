import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { datesRowsAtom, openMonthAtom } from '~/shared/components/layout/sidebar/dates/store';
import { selectedDateAtom } from '~/shared/store';
import dayjs from 'dayjs';

export const backfillStateAtom = atom<'pending' | 'loading'>('pending');

type Day = dayjs.Dayjs | null;
// export const startDateAtom = atom<Day>(dayjs().subtract(30, 'days'));
export const dateStartAtom = atom(<Day>null);
export const dateEndAtom = atom<Day>(null);

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

