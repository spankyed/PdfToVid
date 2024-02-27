import { atom } from 'jotai';
import * as api from './api';
import { checkStatus } from './api';

type DayStatus = 'pending' | 'scraping' | 'ranking' | 'complete' | 'error';

interface Day {
  value: string;
  status: DayStatus;
}

interface DatesList {
  month: string;
  days: Day[];
}
interface MetaData {
  status: number;
  relevancy: number;
  liked: boolean;
  keywords: string[];
}

interface Video {
  title: string;
  description: string;
  thumbnailPrompt: string;
  scriptPrompt: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface Paper {
  id: string;
  date: string;
  title: string;
  abstract: string;
  pdfLink: string;
  authors: string[];
  metaData: MetaData;
  video: Video;
}

interface PapersList {
  day: Day;
  papers: Paper[];
}

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

      console.log('set dateList: ');
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


// Scrape Papers Atom
// export const scrapePapersAtom = atom(
//   null,
//   async (get, set, date) => {
//     // const dashboard = get(dashboardStateAtom);
//     // const dayPapers = dashboard.papersList.find(({ day }) => day.value === date);
    
//     // if (!dayPapers) {
//     if (!date) {
//       console.error("Day not found", date);
//       return;
//     }

//     try {
//       await api.scrapeDay(date);
//       // Continue with the rest of the scraping logic...
//       // Update the dashboardStateAtom with the new data
//     } catch (error) {
//       console.error("Failed to scrape papers: [unknown]", error);
//     }
//   }
// );

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
      // Update status to 'scraping'
      papersList[index].day.status = 'scraping';
      set(papersListAtom, [...papersList]);

      await api.scrapeDay(date);

      // todo refactor to provide status updates async
      await new Promise(resolve => setTimeout(resolve, 7000)); // 4 second delay before we begin checking status
      const status = await checkStatus('days', date);

      // Update the papers list based on the status
      papersList[index].day.status = status.current;
      if (status.current === 'complete') {
        console.log('status.data: ', status.data);
        // papersList[index].papers = JSON.parse(status.data);
        papersList[index].papers = status.data;
      }
      set(papersListAtom, [...papersList]);

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
