import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import dayjs from 'dayjs';
import config from '@config';

type Day = dayjs.Dayjs | null;

export const onboardingState = atom<'onboarding' | 'loading'>('onboarding');

export const canGoNextAtom = atom(true);
export const startDateAtom = atom<Day>(dayjs().subtract(30, 'days'));
export const inputIdsAtom = atom<string[]>([]);
export const autoAddDatesAtom = atom(config.settings.autoAddNewDates);
export const autoScrapeDatesAtom = atom(config.settings.autoScrapeNewDates);
export const maxBackfillAtom = atom(config.settings.maxBackfill);

export const recommendButtonDisabledAtom = atom(false);

export const onboardSubmitAtom = atom(
  null, // write-only atom
  async (get, set) => {
    set(onboardingState, 'loading');
    try {
      const form = {
        startDate: get(startDateAtom)?.format('YYYY-MM-DD'),
        inputIds: get(inputIdsAtom),
        config: {
          autoAddNewDates: get(autoAddDatesAtom),
          autoScrapeNewDates: get(autoScrapeDatesAtom),
          maxBackfill: get(maxBackfillAtom),
        }
      }

      console.log('form: ', form);
      const response = await api.onboard(form);
      console.log('response: ', response);

      set(onboardingState, 'onboarding');

      // console.log('response.data: ', response.data);
      // const { dateList, calendarModel } = response.data;
      // console.log('Backfilled: ', { dateList, calendarModel });

      // set(datesRowsAtom, dateList);
      // set(openMonthAtom, dateList[0]?.month ?? '');

      // const hasDates = dateList.length > 0;
    } catch (error) {
      console.error("Failed to backfill data", error);
      // set(calendarStateAtom, 'error');
    }
  }
);