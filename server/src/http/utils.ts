// ! before adding any paper records, check for existing record with id. if exists change date to latest
/*
// database data examples
const days = [
  {
    value: '2021-10-06',
    hasBeenScraped: true,
  }
]
const papers = [ 
  {
    // initial data upon scrape & filter/rank
    "id": "2308.05713",
    date: '2021-10-06',
    "title": "Testing GPT-4 with Wolfram Alpha and Code Interpreter plug-ins on math and science problems",
    "abstract": "This report describes a test of the large language model GPT-4 with the\nWolfram Alpha and the Code Interpreter plug-ins on 105 original problems in\nscience and math, at the high school and college levels, carried out in\nJune-August 2023. Our tests suggest that the plug-ins significantly enhance\nGPT's ability to solve these problems. Having said that, there are still often\n\"interface\" failures; that is, GPT often has trouble formulating problems in a\nway that elicits useful answers from the plug-ins. Fixing these interface\nfailures seems like a central challenge in making GPT a reliable tool for\ncollege-level calculation problems.",
    "pdfLink": "https://arxiv.org/pdf/2308.05713.pdf",
    "authors": [],
    metaData: {
      "relevancy": .9,
      "keywords": ['cat'],
    },
    // below separately generated
    "video": {
      "title": "A video of a cat",
      "description": "A video of a cat on a ledge. Then jumps'",
      "thumbnailPrompt": "A picture of a cat",
      "scriptPrompt": "A picture of a cat on a ledge. Then jumps'",
      videoUrl: 'videos/230805713', 
      thumbnailUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format', 
    }
  },
]
*/

import Datastore from '@seald-io/nedb';
import path from 'path';

const root = '/Users/spankyed/Develop/Projects/PdfToVid/server/src/files';
function dbPath(name: string) {
  return path.join(root, 'database', `${name}.db`);
}

type DayList = {
  month: string;
  days: DayDocument[];
};

type PaperList = {
  day: string;
  papers: PaperDocument[];
};

type DayDocument = {
  value: string;
  hasBeenScraped: boolean;
};

type PaperDocument = {
  id: string;
  date: string;
  title: string;
  abstract: string;
  pdfLink: string;
  authors: string[];
  metaData: {
    relevancy: number;
    keywords: string[];
  };
  video: {
    title: string;
    description: string;
    thumbnailPrompt: string;
    scriptPrompt: string;
    videoUrl: string;
    thumbnailUrl: string;
  };
};

const store = {
  days: new Datastore<DayDocument>({ filename: dbPath('days'), autoload: true }),
  papers: new Datastore<PaperDocument>({ filename: dbPath('papers'), autoload: true }),
  config: new Datastore<{ lastRun: string }>({ filename: dbPath('config'), autoload: true }),
}

async function storePapers(papers: PaperDocument[]): Promise<void> {
  await store.papers.insertAsync(papers);
}

async function getPapersForDays(days: string[], skip: number = 0, limit: number = -1): Promise<PaperList[]> {
  let query = store.papers.findAsync({ date: { $in: days } })
    .sort({ date: 1, id: 1 });
  
  if (limit !== -1) {
    query = query.limit(limit);
  }

  const papers: PaperDocument[] = await query.skip(skip).execAsync();
  
  const groupedPapers: PaperList[] = days.map(day => ({
    day,
    papers: papers.filter(paper => paper.date === day),
  }));
  
  return groupedPapers;
}

// const getPapersWithPagination = async (lastRetrievedId?: string): Promise<PaperDocument[]> => {
//   let skipCount = 0;
  
//   // If a lastRetrievedId is provided, determine how many records to skip
//   if (lastRetrievedId) {
//     const papersBeforeLastRetrieved: PaperDocument[] = await store.papers.findAsync({ id: { $lte: lastRetrievedId } });
//     skipCount = papersBeforeLastRetrieved.length;
//   }
  
//   // Fetch the next 5 papers after skipping
//   const papers: PaperDocument[] = await store.papers.findAsync({}).sort({ id: 1 }).skip(skipCount).limit(5).execAsync();
  
//   return papers;
// };

async function storeDay(day: string): Promise<void> {
  const existingDay = await store.days.findOneAsync({ value: day });

  if (!existingDay) {
    await store.days.insertAsync({ value: day, hasBeenScraped: false });
  }
}

async function getStoredDays(): Promise<DayDocument[]> {
  const docs: DayDocument[] = await store.days.findAsync({});
  return docs;
}

async function getLastRunDay(): Promise<string | null> {
  const config = await store.config.findOneAsync({});
  return config?.lastRun || null;
}

async function updateLastRunDay(day: string): Promise<void> {
  await store.config.updateAsync({ lastRun: day }, { lastRun: day }, { upsert: true });
}

async function getFiveMostRecentDays(): Promise<DayDocument[]> {
  const recentDays: DayDocument[] = await store.days.findAsync({})
    .sort({ value: -1 }) // Sorting in descending order based on the value field
    .limit(5)            // Limiting the results to the five most recent entries
    .execAsync();

  return recentDays;
}

// UTILITY FUNCTIONS

  async function initializeServer(): Promise<void> {
    const lastRun = await getLastRunDay();
    const today = new Date().toISOString().split('T')[0];
    console.log('today: ', today);

    if (lastRun) {
      const daysToStore = getWeekdaysBetween(lastRun, today);

      console.log('daysToStore: ', daysToStore); // todo test for overlap

      for (const day of daysToStore) {
        await storeDay(day);
      }
    } else {
      await storeDay(today);
    }

    await updateLastRunDay(today);

    console.log('Server initialized and days updated.');
  }

  function getWeekdaysBetween(startDate: string, endDate: string): string[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: string[] = [];

    while (start < end) {
      const dayOfWeek = start.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) and not Saturday (6)
        days.push(start.toISOString().split('T')[0]);
      }
      start.setDate(start.getDate() + 1);
    }

    return days;
  }

  function groupDaysByMonth(days: DayDocument[]): DayList[] {
    const grouped: { [key: string]: DayDocument[] } = {};
  
    for (const day of days) {
      const date = new Date(day.value);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(day);
    }
  
    const result: DayList[] = Object.keys(grouped).map(month => ({
      month,
      days: grouped[month].sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
    }));
  
    return result.sort((a, b) => {
      const dateA = new Date(a.days[0].value);
      const dateB = new Date(b.days[0].value);
      return dateB.getTime() - dateA.getTime();
    });
  }

export {
  getPapersForDays,
  groupDaysByMonth,
  getStoredDays,
  getLastRunDay,
  getFiveMostRecentDays,
  initializeServer,
}

// wipeAllDatastores();
// backfillDays('2023-05-01');

async function backfillDays (date: string): Promise<void> {
  const today = new Date();
  const startDay = new Date(date);

  // Get dates between May 1, 2023, and today
  const daysToBackfill = getWeekdaysBetween(startDay.toISOString().split('T')[0], today.toISOString().split('T')[0]);

  for (const date of daysToBackfill) {
    await storeDay(date);
  }

  console.log('Backfill completed.');
};


async function wipeAllDatastores(): Promise<void> {
  await wipeDatastore(store.days);
  await wipeDatastore(store.config);
  await wipeDatastore(store.papers);
  console.log('All datastores have been wiped.');

  async function wipeDatastore(datastore: Datastore<any>): Promise<void>  {
    await datastore.removeAsync({}, { multi: true });
  };
};
