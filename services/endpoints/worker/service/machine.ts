// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw

import { assign, createMachine } from 'xstate';
// import mocks from '../../../../tests/mocks';
import * as path from 'path';
import { runPythonScript } from '../functions/python-spawner';
import scrapePapersByDate from '../functions/scrape-papers-by-date';
import pyCall from "node-calls-python";
import { getRelevancyScores } from '../functions/relevancy-compute';

export const importModule = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    pyCall.interpreter.import(path).then((pyModule: unknown) => {
      resolve(pyModule);
    }).catch((err: any) => {
      console.error(err);
      reject(err);
    });
  });
};


const scrapeArxiv = async ({ date }) => {
  console.log('scraping papers');
  // await new Promise(resolve => setTimeout(resolve, 4000));
  if (!date) throw new Error('No date provided.');
  const papers = await scrapePapersByDate(date);
  // console.log('papers: ', papers);
  if (!papers) throw new Error('No papers scraped.');
  // console.log('Scraping finished successfully.', { papers });

  return papers;
};


const rankPapers = async (ev, ctx) => {
  console.log('ranking papers');
  // await new Promise(resolve => setTimeout(resolve, 4000));
  // todo refactor to do sentence embedding in typescript: see https://huggingface.co/Xenova/all-MiniLM-L6-v2
  

  // Query embeddings from Chroma
  const dataObject = await getRelevancyScores(ev.papers);
  // console.log('dataObject: ', dataObject);

  // const papers_with_score = await getRelevancy(ev.papers) 
  // const dataObject = extractAndParseData(papers_with_score);

  // console.log('Python script finished successfully.');
  // console.log('papers_with_score: ', {dataObject});
  // console.error(error.message);

  // console.log('dataObject: ', dataObject);
  return dataObject;
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

function extractAndParseData(dataString: string): any | null {
  const match = /###BEGIN_DATA###([\s\S]*?)###END_DATA###/.exec(dataString);
  const extractedData = match && match[1].trim();

  if (extractedData) {
      try {
          return JSON.parse(extractedData);
      } catch (error) {
          console.error("Failed to parse the extracted data:", error);
          return null;
      }
  } else {
      return null;
  }
}

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