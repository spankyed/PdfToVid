import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { selectedDateAtom } from '~/shared/store';
import { CalendarModel } from '~/shared/utils/types';
import { RefObject } from 'react';
import { resetDateStatus } from '../../../shared/api/fetch';

export const calendarStateAtom = atom<'loading' | 'backfill' | 'ready' | 'error'>('loading');
export const calendarModelAtom = atom<CalendarModel>([]);
export const fetchCalendarModelAtom = atom(
  null, // write-only atom
  async (get, set) => {
    try {
      set(calendarStateAtom, 'loading');
      const response = await api.getCalendarModelData();
      const calendarModel = response.data as CalendarModel;
      console.log('Calendar Model: ', { calendarModel });
      set(calendarModelAtom, calendarModel);

      const hasDates = calendarModel.length > 0;
      set(calendarStateAtom, hasDates ? 'ready' : 'backfill')
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      // set(calendarStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calendar", error);
      // set(calendarStateAtom, 'error');
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
      set(calendarModelAtom, [...get(calendarModelAtom), ...calendarModel]);
      set(rowCountUpdatedAtom, true);
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      // set(calendarStateAtom, 'ready');
    } catch (error) {
      console.error("Failed to load more calendar dates", error);
      // set(calendarStateAtom, 'error');
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
      set(calendarModelAtom, calendarModel);
      set(rowCountUpdatedAtom, true);
      // set(calendarStateAtom, 'ready');
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
    } catch (error) {
      console.error("Failed to load more calendar dates", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const resetDateStatusAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    try {
      const { data: success} = await resetDateStatus(date);
      const calendar = [...get(calendarModelAtom)];
      const prevRecord = calendar.find((d) => d.date.value === date);

      if (!success || !prevRecord) {
        return;
      }

      prevRecord.date.status = 'pending';

      set(calendarModelAtom, calendar);

    } catch (error) {
      console.error("Failed to reset date status", error);
      // set(calendarStateAtom, 'error');
    }
  }
);
export const rowCountUpdatedAtom = atom(false);
export const scrollableContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
