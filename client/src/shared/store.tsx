// https://github.com/jetako/mst-async-task
// https://github.com/mobxjs/mobx-state-tree/issues/1415
// https://egghead.io/lessons/react-defining-asynchronous-processes-using-flow
import { types, Instance, flow } from "mobx-state-tree";
import axios from 'axios';

const Paper = types.model("Paper", {
  id: types.identifier,
  title: types.string,
  date: types.string,
  imgUrl: types.string,
  // other properties...
});

const Store = types.model("Store", {
  papers: types.array(Paper),
  // other properties...
})
.actions(self => ({
  // addPaper(paper: Instance<typeof Paper>) {
  //   self.papers.push(paper);
  // },
  fetchPapers: flow(function* fetchPapers() { // using generator function
    try {
      const response = yield axios.get('http://localhost:3000/getAll');
      response.data.forEach((paper: Instance<typeof Paper>) => {
        self.papers.push(paper);
        // self.addPaper(paper);
      });
    } catch (error) {
      console.error("Failed to fetch papers", error);
    }
  }),
  // other actions...
}));

export type StoreType = Instance<typeof Store>;
export default Store;
