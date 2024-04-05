import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { Date } from '~/shared/utils/types';

export const dateEntryStateAtom = atom<'loading' | 'complete' | 'error' | 'unexpected' | 'pending'>('loading');
export const dateEntryScrapingStateAtom = atom<'pending' | 'scraping' | 'ranking' | 'complete'>('pending');

export const dateEntryModelAtom = atom<{
  date: Date | null;
  papers: any[];
}>({
  papers: [],
  date: null,
});

export const fetchPapersByDateAtom = atom(
  null,
  async (get, set, dateId) => {
    if (!dateId) {
      console.error("Date not found", dateId);
      return;
    }

    set(dateEntryStateAtom, 'loading');

    try {
      const response = await api.getDateEntryModel(dateId);
      const model = response.data;
      const { date, papers } = model;
      console.log('model: ', model);
      
      if (!date) {
        throw new Error("Date not found");
      }

      if (date.status === 'complete' && papers.length === 0) {
        set(dateEntryStateAtom, 'unexpected');
      } else {
        set(dateEntryModelAtom, model);
        set(dateEntryStateAtom, date.status);
      }
    } catch (error) {
      console.error("Failed to fetch papers for date", error);
      set(dateEntryStateAtom, 'error');
    }
  }
);

export const scrapePapersDateEntryAtom = atom(
  null,
  async (get, set, value) => {
    console.log('value: ', value);
    try {
      set(dateEntryScrapingStateAtom, 'scraping');

      await api.scrapeDate(value);

    } catch (error) {
      console.error("Scraping failed:", error);
      set(dateEntryScrapingStateAtom, 'pending');
      set(dateEntryStateAtom, 'error');
    }
  }
);

export const resetDateEntryStatusAtom = atom(
  null,
  async (get, set, dateId: string) => {
    try {
      const { data: success } = await api.resetDateStatus(dateId);
      if (!success) {
        return;
      }

      const dateEntry = get(dateEntryModelAtom);

      dateEntry.date = dateEntry.date || { value: dateId, status: 'pending' };
      dateEntry.date.status = 'pending';

      set(dateEntryModelAtom, dateEntry);
      set(dateEntryStateAtom, 'pending');
    } catch (error) {
      console.error("Failed to reset date status", error);
      set(dateEntryStateAtom, 'error');
    }
  }
);