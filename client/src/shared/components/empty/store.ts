import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { calendarModelAtom } from '~/calendar/components/main/store';

export const scrapePapersAtom = atom(
  null,
  async (get, set, value) => {
    let calendarModel = get(calendarModelAtom);
    const index = calendarModel.findIndex(({ date }) => date.value === value);

    if (index === -1) {
      console.error("Date not found", value);
      return;
    }

    try {
      calendarModel[index].date.status = 'scraping';
      set(calendarModelAtom, [...calendarModel]);

      await api.scrapeDate(value);
    } catch (error) {
      console.error("Scraping failed:", error);

      calendarModel[index].date.status = 'error';
      set(calendarModelAtom, [...calendarModel]);
    }
  }
);
