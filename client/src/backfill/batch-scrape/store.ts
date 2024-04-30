import dayjs from 'dayjs';
import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { datesRowsAtom, openMonthAtom } from '~/shared/components/layout/sidebar/dates/store';
import { selectedDateAtom } from '~/shared/store';

export const batchStateAtom = atom<'pending' | 'loading'>('loading');

// export const canGoNextAtom = atom(true);
// export const inputIdsAtom = atom<string[]>([]);
// export const maxBackfillAtom = atom(config.settings.maxBackfill);

const MockDatesTable = Array(21).fill('').map((_, i) => `04/${i}/2024`)
// export const batchDatesAtom = atom<any[]>(MockDatesTable);
export const batchDatesAtom = atom<any[]>([]);

export const getDatesAtom = atom(
  null, // write-only atom
  async (get, set, direction) => {
    set(batchStateAtom, 'loading');
    try {
      const hasDates = get(batchDatesAtom).length > 0;
      const cursor = direction === 'right' ? get(batchDatesAtom).slice(-1)[0] : get(batchDatesAtom)[0];
      const formattedCursor = dayjs(cursor).format('YYYY-MM-DD')
      // const response = await api.getBatchDates({ cursor: hasDates ? formattedCursor : undefined, direction });
      const records = response.data;
      console.log('Loaded dates: ', { records });

      set(batchDatesAtom, records.map(d => dayjs(d.value).format('MM/DD/YYYY')));

      set(batchStateAtom, 'pending');
    } catch (error) {
      console.error("Failed to get batch data", error);
    }
  }
);
export const batchScrapeAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    set(batchStateAtom, 'loading');
    try {
      const response = await api.scrapeBatch(date);
      const { records, newCount } = response.data;
      console.log('Backfilled: ', { records, newCount });

      set(datesRowsAtom, records);
      // set(selectedDateAtom, records[0]?.dates[0]?.value ?? '');
      set(openMonthAtom, records[0]?.month ?? '');

      set(batchStateAtom, 'pending');

      // const hasDates = records.length > 0;
    } catch (error) {
      console.error("Failed to backfill data", error);
      // set(calendarStateAtom, 'error');
    }
  }
);

