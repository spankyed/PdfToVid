// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw

import { assign, createMachine } from 'xstate';
import mocks from '../../../../tests/mocks';
import * as path from 'path';
import { runPythonScript } from '../functions/python-spawner';
import scrapePapersByDate from '../functions/scrape-papers-by-date';

const scrapeArxiv = async ({ date }) => {
  console.log('date: ', date);
  if (!date) throw new Error('No date provided.');
  const papers = await scrapePapersByDate(date);
  console.log('Scraping finished successfully.');
  // console.log('Scraping finished successfully.', { papers });

  return papers;
};

const rankPapers = async (ev, ctx) => {
  console.log('ranking papers');
  // todo refactor to do sentence embedding in typescript: see https://huggingface.co/Xenova/all-MiniLM-L6-v2
  const root = '/Users/spankyed/Develop/Projects/CurateGPT/services/endpoints/worker/functions/';
  const getRelevancy = runPythonScript(path.join(root, 'relevancy-semantic-sbert.py')) 

  const papers_with_score = await getRelevancy(ev.papers) 

  console.log('Python script finished successfully.');
  console.log('papers_with_score: ', papers_with_score);
  // console.log('Data string: ', JSON.parse(data));
  // console.error(error.message);

  return papers_with_score;
  // return mocks.paperList[0].papers;
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