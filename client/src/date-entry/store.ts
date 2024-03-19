import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';

// Date Page state atom
export const datePageStateAtom = atom({
  papers: [],
  state: 'pending',
});
// Fetch Papers for Date Atom
export const fetchPapersByDateAtom = atom(
  null,
  async (get, set, dateId) => {
    if (!dateId) {
      console.error("Date not found", dateId);
      return;
    }

    try {
      const response = await api.getPapersByDate(dateId);
      const papers = response.data;
      set(datePageStateAtom, { papers, state: 'complete' });
    } catch (error) {
      console.error("Failed to fetch papers for date", error);
      set(datePageStateAtom, prev => ({ ...prev, state: 'error' }));
    }
  }
);
