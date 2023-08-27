// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw

import { assign, createMachine } from 'xstate';
import mocks from '../../../../tests/mocks';

const scrapeArxiv = async (context, event) => {
  // For now, let's return a mock list of papers
  return mocks.paperList[0].papers;
};

const rankPapers = async (papers) => {
  // For now, let's return the papers as they are
  return mocks.paperList[0].papers;
};


interface ScrapeContext {
  date: string;
  papers?: [];
}

export const scrapeMachine = createMachine({
  id: 'arxiv_scraper',
  initial: 'scraping',
  schema: {
    context: {} as ScrapeContext
  },
  context: {
    date: '',
    papers: []
  },
  states: {
    scraping: {
      invoke: {
        src: scrapeArxiv,
        onDone: {
          target: 'ranking',
          actions: assign({ papers: (_, event) => {
            console.log('ranking: ', event);
            return event.data;
          }})
        },
        onError: 'cancelled'
      }
    },
    ranking: {
      invoke: {
        src: (context) => rankPapers(context.papers),
        onDone: {
          target: 'complete',
          actions: assign({ papers: (_, event) => {
            console.log('ranking: ', event);
            return event.data;
          }})
        },
        onError: 'cancelled'
      }
    },
    complete: {
      type: 'final',
      data: (context) => context.papers
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