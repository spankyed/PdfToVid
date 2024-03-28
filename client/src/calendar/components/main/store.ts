import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { selectedDateAtom } from '~/shared/store';
import { CalendarModel } from '~/shared/utils/types';
import { RefObject } from 'react';
import { resetDateStatus } from '../../../shared/api/fetch';
import { splitAtom } from 'jotai/utils'

export const calendarStateAtom = atom<'loading' | 'backfill' | 'ready' | 'error'>('loading');
export const calendarModelAtomBase = atom<CalendarModel>([]);
export const calendarModelAtom = splitAtom(calendarModelAtomBase);

export const fetchCalendarModelAtom = atom(
  null,
  async (get, set) => {
    try {
      set(calendarStateAtom, 'loading');
      const response = await api.getCalendarModelData();
      const calendarModel = response.data as CalendarModel;
      console.log('Calendar Model: ', calendarModel);
      set(calendarModelAtomBase, calendarModel);

      const hasDates = calendarModel.length > 0;
      set(calendarStateAtom, hasDates ? 'ready' : 'backfill');
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
    } catch (error) {
      console.error("Failed to fetch calendar", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const calendarLoadMoreAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    try {
      // set(calendarStateAtom, 'loading');
      const response = await api.calendarLoadMore(date);
      const calendarModel = response.data as CalendarModel;
      set(calendarModelAtomBase, [...get(calendarModelAtomBase), ...calendarModel]);
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      // set(calendarStateAtom, 'ready');
    } catch (error) {
      console.error("Failed to load more calendar dates", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const calendarLoadMonthAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    // set(calendarStateAtom, 'loading');
    try {
      const response = await api.calendarLoadMonth(date);
      const calendarModel = response.data as CalendarModel;
      set(calendarModelAtomBase, calendarModel);
      // set(calendarStateAtom, 'ready');
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
    } catch (error) {
      console.error("Failed to load more calendar dates", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const resetDateStatusAtom = atom(
  null,
  async (get, set, date) => {
    try {
      const { data: success } = await resetDateStatus(date);
      if (!success) {
        return;
      }

      const calendar = get(calendarModelAtomBase);
      const index = calendar.findIndex((d) => d.date.value === date);

      if (index === -1) {
        return;
      }

      // Clone the item to mutate
      const updatedItem = { ...calendar[index] };
      updatedItem.date.status = 'pending';

      // Use a functional update to only modify the item that has changed
      set(calendarModelAtomBase, (prev) => [
        ...prev.slice(0, index),
        updatedItem,
        ...prev.slice(index + 1),
      ]);
    } catch (error) {
      console.error("Failed to reset date status", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const scrollableContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
