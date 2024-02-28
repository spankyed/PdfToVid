import { atom } from 'jotai';
import * as api from '../api';
import { DatesList, PapersList } from './types';

// export const dashboardStateAtom = atom('initial');
export const datesListAtom = atom<DatesList[]>([]);
export const selectedDayAtom = atom<string>('');
export const openMonthAtom = atom<string>('');
export const papersListAtom = atom<PapersList[]>([]);
export const fetchDashboardDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(dashboardStateAtom, 'loading');
    try {
      const response = await api.getDashboardData();
      const { dateList, paperList } = response.data;
      console.log('dateList: ', dateList);
      console.log('paperList: ', paperList);
      set(datesListAtom, dateList);
      set(papersListAtom, paperList);
      set(selectedDayAtom, dateList[0]?.days[0]?.value ?? '');
      set(openMonthAtom, dateList[0]?.month ?? '');
      // set(dashboardStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
      // set(dashboardStateAtom, 'error');
    }
  }
);
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
const dayPageStateAtom = atom({
  papers: [],
  state: 'pending',
});

// Fetch Papers for Day Atom
const fetchPapersForDayAtom = atom(
  null,
  async (get, set, dayId) => {
    if (!dayId) {
      console.error("Day not found", dayId);
      return;
    }

    try {
      const response = await api.getPapersForDay(dayId);
      const papers = response.data;
      set(dayPageStateAtom, { papers, state: 'complete' });
    } catch (error) {
      console.error("Failed to fetch papers for day", error);
      set(dayPageStateAtom, prev => ({ ...prev, state: 'error' }));
    }
  }
);
