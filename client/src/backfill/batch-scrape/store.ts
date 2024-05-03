import dayjs from 'dayjs';
import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';

export const batchStateAtom = atom<'pending' | 'loading'>('loading');

// export const canGoNextAtom = atom(true);
// export const inputIdsAtom = atom<string[]>([]);
// export const maxBackfillAtom = atom(config.settings.maxBackfill);

// const MockDatesTable = Array(21).fill('').map((_, i) => `04/${i}/2024`)
// export const batchDatesAtom = atom<any[]>(MockDatesTable);

export type DateItem = {
  value: string;
  status: string;
  count?: number;
}

export const buttonsDisabledAtom = atom({
  left: false,
  right: false,
  leftEnd: false,
  rightEnd: false,
});

export const batchDatesAtom = atom<DateItem[]>([]);

type Direction = 'left' | 'right' | 'leftEnd' | 'rightEnd';

export const getDatesAtom = atom(
  null, // write-only atom
  async (get, set, direction: Direction) => {
    set(batchStateAtom, 'loading');
    try {
      const hasDates = get(batchDatesAtom).length > 0;
      const useCursor = hasDates && !direction.includes('End');
      const oppositeDirection = direction.includes('right') ? 'left' : 'right';
      const cursor = direction === 'right' ? get(batchDatesAtom).slice(-1)[0] : get(batchDatesAtom)[0];
      const formattedCursor = cursor?.value
      const response = await api.getBatchDates({
        cursor: useCursor ? formattedCursor : undefined,
        direction: useCursor ? direction : oppositeDirection, // ! don't ask questions just go with it
      });
      const records = response.data;

      const responseHasDates = records.length > 0;

      if (!responseHasDates || !useCursor) {
        set(buttonsDisabledAtom, prev => ({ ...prev, [direction]: true }));
        if (direction.includes('End')){
          set(buttonsDisabledAtom, prev => ({ ...prev, [direction.split('End')[0]]: true }));
        } else {
          set(buttonsDisabledAtom, prev => ({ ...prev, [direction + 'End']: true }));
        }
      }

      if (responseHasDates) {
        const oppositeDirection = direction.includes('right') ? 'left' : 'right';
        set(buttonsDisabledAtom, prev => ({
          ...prev,
          [oppositeDirection]: false,
          [oppositeDirection + 'End']: false,
        }));

        set(batchDatesAtom, records.map(d => ({
          value: d.value,
          status: d.status,
        })));
      }
      
      console.log('Loaded dates: ', { records });

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
      const dates = get(batchDatesAtom);
      const response = await api.scrapeBatch(dates.map(d => d.value));
      console.log('response: ', response);
      // const { records, newCount } = response.data;
      // console.log('Backfilled: ', { records, newCount });

      // set(batchStateAtom, 'pending');

      // const hasDates = records.length > 0;
    } catch (error) {
      console.error("Failed to backfill data", error);
      // set(calendarStateAtom, 'error');
    }
  }
);

export const updateStatusAtom = atom(
  null, // write-only atom
  async (get, set, { date, status, count }) => {
    set(batchDatesAtom, prev => prev.map(d => {
      if (d.value === date) {
        return {
          ...d,
          status,
          count,
        };
      }
      return d;
    }));
  }
);

// export const resetStateAtom = atom(
//   null, // write-only atom
//   async (get, set) => {
//     set(batchStateAtom, 'pending');
//     set(batchDatesAtom, []);
//     set(buttonsDisabledAtom, {
//       left: false,
//       right: false,
//       leftEnd: false,
//       rightEnd: false,
//     });
//   }
// );
