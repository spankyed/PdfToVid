import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { selectedDateAtom } from '~/shared/store';
import { CalenderModel } from '~/shared/utils/types';
import { RefObject } from 'react';
import { resetDateStatus } from '../../../shared/api/fetch';

export const calenderStateAtom = atom<'loading' | 'backfill' | 'ready' | 'error'>('loading');
export const calenderModelAtom = atom<CalenderModel>([]);
export const fetchCalenderModelAtom = atom(
  null, // write-only atom
  async (get, set) => {
    try {
      set(calenderStateAtom, 'loading');
      const response = await api.getCalenderModelData();
      const calenderModel = response.data as CalenderModel;
      console.log('Calender Model: ', { calenderModel });
      set(calenderModelAtom, calenderModel);

      const hasDates = calenderModel.length > 0;
      console.log('hasDates: ', hasDates);
      set(calenderStateAtom, hasDates ? 'ready' : 'backfill')
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      // set(calenderStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calender", error);
      // set(calenderStateAtom, 'error');
    }
  }
);
export const calenderLoadMoreAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    try {
      set(calenderStateAtom, 'loading');
      const response = await api.calenderLoadMore(date);
      const calenderModel = response.data as CalenderModel;
      console.log('load more: ', calenderModel);
      console.log('more.length: ', calenderModel.length);
      set(calenderModelAtom, [...get(calenderModelAtom), ...calenderModel]);
      set(rowCountUpdatedAtom, true);
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      // set(calenderStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to load more calender dates", error);
      // set(calenderStateAtom, 'error');
    }
  }
);

export const resetDateStatusAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    try {
      const { data: success} = await resetDateStatus(date);
      const calender = [...get(calenderModelAtom)];
      const prevRecord = calender.find((d) => d.date.value === date);

      if (!success || !prevRecord) {
        return;
      }

      prevRecord.date.status = 'pending';

      set(calenderModelAtom, calender);

    } catch (error) {
      console.error("Failed to reset date status", error);
      // set(calenderStateAtom, 'error');
    }
  }
);
export const rowCountUpdatedAtom = atom(false);
export const scrollableContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
