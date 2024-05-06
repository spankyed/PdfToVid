import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { setSidebarDataAtom } from '~/shared/components/layout/sidebar/dates/store';
import { selectedDateAtom } from '~/shared/store';
import dayjs from 'dayjs';
import { addSnackAtom } from '~/shared/components/notification/store';
import { batchStateAtom, getDatesAtom } from '../batch-scrape/store';

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
      const { dateList, newCount } = response.data;

      set(setSidebarDataAtom, dateList);

      set(backfillStateAtom, 'pending');
      
      set(addSnackAtom, { message: `Added ${newCount} dates`, autoClose: true });

      const batchState = get(batchStateAtom);

      if(batchState === 'idle') {
        set(getDatesAtom, 'rightEnd');
      }
    } catch (error) {
      console.error("Failed to backfill data", error);
      // set(calendarStateAtom, 'error');
    }
  }
);

