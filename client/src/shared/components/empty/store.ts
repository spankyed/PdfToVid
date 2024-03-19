import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { calenderModelAtom } from '~/calender/components/main/store';

export const scrapePapersAtom = atom(
  null,
  async (get, set, value) => {
    let calenderModel = get(calenderModelAtom);
    const index = calenderModel.findIndex(({ date }) => date.value === value);

    if (index === -1) {
      console.error("Day not found", value);
      return;
    }

    try {
      calenderModel[index].date.status = 'scraping';
      set(calenderModelAtom, [...calenderModel]);

      await api.scrapeDay(value);
    } catch (error) {
      console.error("Scraping failed:", error);

      calenderModel[index].date.status = 'error';
      set(calenderModelAtom, [...calenderModel]);
    }
  }
);
