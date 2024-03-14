import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { papersListAtom } from '~/calender/components/grid/store';

// Day Page state atom
export const dayPageStateAtom = atom({
  papers: [],
  state: 'pending',
});
// Fetch Papers for Day Atom
export const fetchPapersForDayAtom = atom(
  null,
  async (get, set, dateId) => {
    if (!dateId) {
      console.error("Day not found", dateId);
      return;
    }

    try {
      const response = await api.getPapersForDay(dateId);
      const papers = response.data;
      set(dayPageStateAtom, { papers, state: 'complete' });
    } catch (error) {
      console.error("Failed to fetch papers for day", error);
      set(dayPageStateAtom, prev => ({ ...prev, state: 'error' }));
    }
  }
);
