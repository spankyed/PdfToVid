import { atom } from 'jotai';
import dayjs from 'dayjs';
import config from '@config';

type Day = dayjs.Dayjs | null;

export const onboardingStateAtom = atom<'onboarding' | 'loading'>('onboarding');

export const canGoNextAtom = atom(true);
export const startDateAtom = atom<Day>(dayjs().subtract(30, 'days'));
export const inputIdsAtom = atom<string[]>([]);
export const autoAddDatesAtom = atom(config.settings.autoAddNewDates);
export const autoScrapeDatesAtom = atom(config.settings.autoScrapeNewDates);
export const maxBackfillAtom = atom(config.settings.maxBackfill);

export const recommendButtonDisabledAtom = atom(false);
