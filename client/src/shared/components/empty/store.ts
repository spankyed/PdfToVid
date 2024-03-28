import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { calendarModelAtom } from '~/calendar/store';

export const scrapePapersAtom = atom(
  null,
  async (get, set, value) => {
    const dateAtoms = get(calendarModelAtom);

    let targetDateAtom = dateAtoms.find((dateAtom) => {
      const { date } = get(dateAtom);
      return date.value === value;
    });

    if (!targetDateAtom) {
      console.error("Date not found", value);
      return;
    }

    try {
      set(targetDateAtom, (prevDate) => ({ ...prevDate, date: { ...prevDate.date, status: 'scraping' } }));

      await api.scrapeDate(value);

    } catch (error) {
      console.error("Scraping failed:", error);
      set(targetDateAtom, (prevDate) => ({ ...prevDate, date: { ...prevDate.date, status: 'error' } }));
    }
  }
);