// https://github.com/jetako/mst-async-task
// https://github.com/mobxjs/mobx-state-tree/issues/1415
// https://egghead.io/lessons/react-defining-asynchronous-processes-using-flow
import { types, Instance, flow } from "mobx-state-tree";
import axios from 'axios';

// type Paper = {
//   id: string;
//   date: string;
//   title: string;
//   abstract: string;
//   pdfLink: string;
//   authors: string[];
//   metaData: {
//     relevancy: number;
//     keywords: string[];
//   };
//   video: {
//     title: string;
//     description: string;
//     thumbnailPrompt: string;
//     scriptPrompt: string;
//     videoUrl: string;
//     thumbnailUrl: string;
//   };
// };

const Paper = types.model({
  id: types.string,
  date: types.string,
  title: types.string,
  abstract: types.string,
  pdfLink: types.string,
  authors: types.array(types.string),
  metaData: types.model({
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
  hasBeenScraped: types.boolean
});

const DayList = types.model({
  day: types.string,
  papers: types.array(Paper),
});

const MonthList = types.model({
  month: types.string,
  days: types.array(Day)
});

const Store = types.model("Store", {
  // days: types.array(Day),
  monthDaysList: types.array(MonthList),
  dayPapersList: types.array(DayList),
  papersForDay: types.array(Paper),
  // other properties...
})

.actions(self => ({
  fetchDashboard: flow(function* () {
    try {
      const response = yield axios.get('http://localhost:3000/dashboard');
      console.log('response: ', response);
      response.data.dateList.forEach((monthList: Instance<typeof MonthList>) => {
        console.log('monthList: ', monthList);
        self.monthDaysList.push(monthList);
        // self.papersForDay.push(paper);
      });
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    }
  }),
  scrapePapers: flow(function* (date) { // using generator function
    try {
      const response = yield axios.get('http://localhost:3000/scrape/' + date);
      console.log('response: ', response);
      response.data.forEach((paper: Instance<typeof Paper>) => {
        // self.addPaper(paper);
      });
    } catch (error) {
      console.error("Failed to scrape papers", error);
    }
  }),
  fetchPapers: flow(function* fetchPapers(date) { 
    try {
      const response = yield axios.get('http://localhost:3000/papersByDate/' + date);
      response.data.forEach((paper: Instance<typeof Paper>) => {
        self.papersForDay.push(paper);
        // self.addPaper(paper);
      });
    } catch (error) {
      console.error("Failed to fetch papers", error);
    }
  }),
  // addPaper(paper: Instance<typeof Paper>) {
  //   self.Dates.push(paper);
  // },
}));

export const store = Store.create({ papers: [] });

export type StoreType = Instance<typeof Store>;
export default Store;
