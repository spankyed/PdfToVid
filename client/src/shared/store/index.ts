import { atom } from 'jotai';
import * as api from '../api/fetch';
import { papersListAtom } from '~/calender/components/grid/store';

export const selectedDayAtom = atom<string>('');

export const scrapePapersAtom = atom(
  null,
  async (get, set, date) => {
    let papersList = get(papersListAtom);
    const index = papersList.findIndex(({ day }) => day.value === date);

    if (index === -1) {
      console.error("Day not found", date);
      return;
    }

    try {
      papersList[index].day.status = 'scraping';
      set(papersListAtom, [...papersList]);

      await api.scrapeDay(date);
    } catch (error) {
      console.error("Scraping failed:", error);

      papersList[index].day.status = 'error';
      set(papersListAtom, [...papersList]);
    }
  }
);

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
