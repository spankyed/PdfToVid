import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { papersListAtom } from '~/calender/components/grid/store';

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
