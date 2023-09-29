// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw

import { assign, createMachine } from 'xstate';
// import mocks from '../../../../tests/mocks';
import scrapePapersByDate from '../functions/scrape-papers-by-date';
import { getRelevancyScores } from '../functions/relevancy-compute';


const scrapeArxiv = async ({ date }) => {
  console.log('scraping papers');
  if (!date) throw new Error('No date provided.');
  const papers = await scrapePapersByDate(date);
  // console.log('papers: ', papers);
  if (!papers) throw new Error('No papers scraped.');
  // console.log('Scraping finished successfully.', { papers });

  return papers;
};

const rankPapers = async (ev, ctx) => {
  console.log('ranking papers');
  // Query embeddings from Chroma
  const dataObject = await getRelevancyScores(ev.papers);
  // console.log('papers_with_score: ', {dataObject});
  // console.error(error.message);

  return dataObject;
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
            // console.log('scraping: ', event);
            return event.data;
          }})
        },
        onError: 'cancelled'
      }
    },
    ranking: {
      invoke: {
        src: rankPapers,
        onDone: {
          target: 'complete',
          actions: assign({ papers: (_, event) => {
            // console.log('ranking: ', event);
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