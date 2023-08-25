// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw
const { Machine, actions } = require('xstate');
const { assign } = actions;

const scrapeArxiv = async (context, event) => {
  // Implement the scraping logic here
  // For now, let's return a mock list of papers
  return [
    { title: "Paper 1", content: "Abstract 1" },
    { title: "Paper 2", content: "Abstract 2" },
  ];
};

const rankPapers = async (papers) => {
  // Implement the ranking logic here
  // For now, let's return the papers as they are
  return papers;
};

const arxivMachine = Machine({
  id: 'arxiv',
  initial: 'pending',
  context: {
    papers: []
  },
  states: {
    pending: {
      on: {
        SCRAPE: 'scraping'
      }
    },
    scraping: {
      invoke: {
        src: scrapeArxiv,
        onDone: {
          target: 'ranking',
          actions: assign({ papers: (_, event) => event.data })
        },
        onError: 'pending'
      }
    },
    ranking: {
      invoke: {
        src: (context) => rankPapers(context.papers),
        onDone: {
          target: 'completed',
          actions: assign({ papers: (_, event) => event.data })
        },
        onError: 'pending'
      }
    },
    completed: {
      type: 'final'
    },
    cancelled: {
      type: 'final'
    }
  }
});


// type PaperDocument = {
//   id: string;
//   date: string;
//   title: string;
//   abstract: string;
//   pdfLink: string;
//   authors: string[];
//   metaData?: {
//     relevancy: number;
//     keywords?: string[];
//   };
// };