// https://github.com/jetako/mst-async-task
// https://github.com/mobxjs/mobx-state-tree/issues/1415
// https://egghead.io/lessons/react-defining-asynchronous-processes-using-flow
import { types, Instance, flow } from "mobx-state-tree";
import * as api from "./api";

export type Paper = Instance<typeof Paper>;

const RoutingModel = types.model({
  currentPath: types.string,
  params: types.map(types.string)
}).actions(self => ({
  setPath(path: string) {
    self.currentPath = path;
  },
  setParams(params: { [key: string]:  string | undefined }) {
    self.params.clear();
    for (let key in params) {
      self.params.set(key, params[key] ?? '');
    }
  }
}));

const Paper = types.model({
  id: types.string,
  date: types.string,
  title: types.string,
  abstract: types.string,
  pdfLink: types.string,
  authors: types.array(types.string),
  metaData: types.optional(types.model({
    status: types.number,
    relevancy: types.number,
    liked: types.optional(types.boolean, false),
    keywords: types.optional(types.array(types.string), []),
  }), { status: 0, relevancy: 0 }),
  video: types.optional(types.model({
    title: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    thumbnailPrompt: types.optional(types.string, ''),
    scriptPrompt: types.optional(types.string, ''),
    videoUrl: types.optional(types.string, ''),
    thumbnailUrl: types.optional(types.string, '')
  }), {}),
});

const Day = types.model({
  value: types.string,
  status: types.enumeration('DayStatus', ['pending', 'scraping', 'ranking', 'complete'])
});

const DatesList = types.model({
  month: types.string,
  days: types.array(Day)
});

const PapersList = types.model({
  day: Day,
  papers: types.array(Paper),
});

const Dashboard = types.model("Dashboard", {
  state: types.enumeration('DashboardState', ['initial', 'loading', 'selected', 'error']),
  datesList: types.array(DatesList),
  papersList: types.array(PapersList),
  selectedDay: types.string,
  openMonth: types.string,
  papersForDay: types.array(Paper),
}).actions(self => ({
  fetchDashboard: flow(function* fetchDashboard() {
    try {
      const response = yield api.getDashboardData();
      console.log('response: ', response);
      const { dateList, paperList } = response.data;
      self.papersList = paperList;
      console.log(1);
      self.datesList = dateList;
      console.log(2);
      self.selectedDay = dateList[0]?.days[0]?.value ?? '';
      self.openMonth = dateList[0]?.month ?? '';
      self.state = 'selected';
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    }
  }),

  scrapePapers: flow(function* (date) {
    console.log('scrape papers', date);
    const dayPapers = self.papersList.find(({ day }) => day.value === date);
    if (!dayPapers) {  
      console.error("Day not found", date);
      return 
    }
    dayPapers.day.status = 'scraping';

    try {
      yield api.scrapeDay(date);

      yield new Promise(resolve => setTimeout(resolve, 4000)); // 4 second delay before we begin checking status

      const status = yield api.checkStatus('days', date);

      const checkFailed = !status || !status.current || status.current === 'error';

      if (checkFailed) {
        console.error("Failed to scrape papers: [bad status]", status?.current);
      }
      
      dayPapers.day.status = status.current;

      if (status.current === 'ranking') {
        // todo estimate time based on number of scraped papers
        // yield new Promise(resolve => setTimeout(resolve, 45000)); // 4 second delay before we begin checking status

        const newStatus = yield api.checkStatus('days', date);
        dayPapers.day.status = newStatus.current;
        console.log('complete status.data: ', newStatus.data);
        dayPapers.papers = newStatus.data;
      } else {
        if (status.current !== 'complete') {
          console.error("Failed to scrape papers: [incomplete]", status?.current);
        }

        dayPapers.day.status = status.current;
        dayPapers.papers = JSON.parse(status.data);
        console.log('complete status.data: ', status.data);
      }

      // console.log('complete status: ', status);
    } catch (error) {
      console.error("Failed to scrape papers: [unknown]", error);
      // dayPapers.day.status = 'error';
    }
  }),
  setState(state: string) {
    self.state = state;
  },
  setOpenMonth(month: string) {
    self.openMonth = month;
  },
  selectDay(day: string) {
    self.selectedDay = day;
  },
}));

const DayPage = types.model({
  papers: types.array(Paper),
  state: types.enumeration('DayState', ['pending', 'scraping', 'ranking', 'complete']),
}).actions(self => ({
  fetchPapersForDay: flow(function* fetchPapersForDay(dayId) {
    try {
      if (!dayId) {  
        console.error("Day not found", dayId);
        return 
      }
      console.log('dayId: ', dayId);
      const response = yield api.getPapersForDay(dayId);
      const papers = response.data;
      console.log('papers for day: ', papers);
      self.papers = papers;
      self.state = 'complete';
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    }
  }),
}));

const Store = types.model("Store", {
  routing: types.optional(RoutingModel, {
    currentPath: '/',
    params: {}
  }),
  dashboard: types.optional(Dashboard, {
    state: "initial",
    datesList: [],
    papersList: [],
    papersForDay: [],
    selectedDay: '',
    openMonth: '',
  }),
  dayPage: types.optional(DayPage, {
    papers: [],
    state: 'pending',
  }),
  // ... other properties for other pages ...
});

export const store = Store.create(); // instance of the root model
export type StoreType = Instance<typeof Store>;
