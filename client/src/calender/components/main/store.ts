import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { selectedDateAtom } from '~/shared/store';
import { CalenderModel } from '~/shared/utils/types';
import { hasDatesAtom } from '../backfill/store';
import { RefObject } from 'react';

export const calenderModelAtom = atom<CalenderModel>([]);
export const fetchCalenderModelAtom = atom(
  null, // write-only atom
  async (get, set) => {
    try {
      // set(calenderStateAtom, 'loading');
      const response = await api.getCalenderModelData();
      const calenderModel = response.data as CalenderModel;
      console.log('calenderModel: ', calenderModel);
      console.log('calenderModel.length: ', calenderModel.length);
      set(calenderModelAtom, calenderModel);
      set(hasDatesAtom, calenderModel.length > 0);
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
      // set(calenderStateAtom, 'loading');
      const response = await api.calenderLoadMore(date);
      const calenderModel = response.data as CalenderModel;
      console.log('load more: ', calenderModel);
      console.log('more.length: ', calenderModel.length);
      set(calenderModelAtom, [...get(calenderModelAtom), ...calenderModel]);
      set(rowCountUpdatedAtom, true);
      // set(hasDatesAtom, calenderModel.length > 0);
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      // set(calenderStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calender", error);
      // set(calenderStateAtom, 'error');
    }
  }
);
export const rowCountUpdatedAtom = atom(false);
export const scrollableContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
