// src/store.js

import { types } from "mobx-state-tree";

const Paper = types.model("Paper", {
  id: types.identifier,
  title: types.string,
  date: types.string,
  // other properties...
});

const Store = types.model("Store", {
  papers: types.array(Paper),
  // other properties...
})
.actions(self => ({
  addPaper(paper) {
    self.papers.push(paper);
  },
  // other actions...
}));

export default Store;
