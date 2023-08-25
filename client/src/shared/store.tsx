// https://github.com/jetako/mst-async-task
// https://github.com/mobxjs/mobx-state-tree/issues/1415
// https://egghead.io/lessons/react-defining-asynchronous-processes-using-flow
import { types, Instance, flow } from "mobx-state-tree";
import axios from 'axios';

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
  metaData: types.model({
    liked: types.boolean,
    status: types.number,
    relevancy: types.number,
    keywords: types.array(types.string)
  }),
  video: types.model({
    title: types.string,
    description: types.string,
    thumbnailPrompt: types.string,
    scriptPrompt: types.string,
    videoUrl: types.string,
    thumbnailUrl: types.string
  })
});

const Day = types.model({
  value: types.string,
  status: types.enumeration('DayStatus', ['pending', 'scraping', 'complete'])
});

const DatesList = types.model({
  month: types.string,
  days: types.array(Day)
});

const PapersList = types.model({
  day: types.string,
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
      // self.state = 'loading';
      const response = yield axios.get('http://localhost:3000/dashboard');
      const { dateList, paperList } = response.data;
      console.log('dashboard data: ', { dateList, paperList });
      self.papersList = paperList;
      self.datesList = dateList;
      self.selectedDay = dateList[0]?.days[0]?.value ?? '';
      self.openMonth = dateList[0]?.month ?? '';
      self.state = 'selected';

    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    }
  }),
  // scrapePapers: flow(function* (date: string) {
  //   try {
  //     const response = yield axios.get('http://localhost:3000/scrape/' + date);
  //     console.log('response: ', response);
  //     // ... handle the response ...
  //   } catch (error) {
  //     console.error("Failed to scrape papers", error);
  //   }
  // }),
  // fetchPapers: flow(function* fetchPapers(date: string) {
  //   try {
  //     const response = yield axios.get('http://localhost:3000/papersByDate/' + date);
  //     response.data.forEach((paper: Instance<typeof Paper>) => {
  //       self.papersForDay.push(paper);
  //     });
  //   } catch (error) {
  //     console.error("Failed to fetch papers", error);
  //   }
  // }),
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
  // ... other properties for other pages ...
});

export const store = Store.create(); // instance of the root model
export type StoreType = Instance<typeof Store>;
