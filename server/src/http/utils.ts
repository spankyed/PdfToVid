// ! before adding any paper records, check for existing record with id. if exists change date to latest
import Datastore from '@seald-io/nedb';
import path from 'path';

const root = '/Users/spankyed/Develop/Projects/PdfToVid/server/src/files';
const dbPath = (name: string) => path.join(root, 'database', `${name}.db`);

type DateList = {
  [key: string]: string[];
};

type DateDocument = {
  dateValue: string;
};

type PaperList = {
  [key: string]: PaperDocument[];
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
  dates: new Datastore<DateDocument>({ filename: dbPath('dates'), autoload: true }),
  config: new Datastore<{ lastRun: string }>({ filename: dbPath('config'), autoload: true }),
  papers: new Datastore<PaperDocument>({ filename: dbPath('papers'), autoload: true }),
}

const getStoredDates = async (): Promise<DateDocument[]> => {
  const docs: DateDocument[] = await store.dates.findAsync({});
  return docs;
};

const storeDate = async (date: string): Promise<void> => {
  const existingDate = await store.dates.findOneAsync({ dateValue: date });

  if (!existingDate) {
    await store.dates.insertAsync({ dateValue: date });
  }
};

const getLastRunDate = async (): Promise<string | null> => {
  const config = await store.config.findOneAsync({});
  return config?.lastRun || null;
};

const updateLastRunDate = async (date: string): Promise<void> => {
  await store.config.updateAsync({ lastRun: date }, { lastRun: date }, { upsert: true });
};

const getDatesBetween = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  while (start <= end) {
    dates.push(start.toISOString().split('T')[0]);
    start.setDate(start.getDate() + 1);
  }

  return dates;
};

const getLastFiveDaysOfCurrentMonth = (): string[] => {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startOfLastFiveDays = new Date(endOfMonth);
  startOfLastFiveDays.setDate(endOfMonth.getDate() - 4);
  
  return getDatesBetween(startOfLastFiveDays.toISOString().split('T')[0], endOfMonth.toISOString().split('T')[0]);
};

const initializeServer = async (): Promise<void> => {
  // get all previously stored dates
  // get date of last run
  // get all dates between last run and today
  // const storedDates = await getStoredDates();
  const lastRun = await getLastRunDate();
  const today = new Date().toISOString().split('T')[0];

  if (lastRun) {
    // const datesToStore = getDatesBetween(lastRun, today).filter(date => !storedDates.includes(date));
    const datesToStore = getDatesBetween(lastRun, today);
    for (const date of datesToStore) {
      await storeDate(date);
    }
  } else {
    await storeDate(today);
  }

  await updateLastRunDate(today);

  // todo set interval to update dates every day while server running
  // set timer to update dates next day, then an interval for every day after

  console.log('Server initialized and dates updated.');
};

function groupByMonth(dates: string[]): DateList {
  return dates.reduce((acc: DateList, day: string) => {
    const date = new Date(day);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    const dateStringWithoutYear = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' });

    acc[monthYear] = acc[monthYear] || [];
    acc[monthYear].push(dateStringWithoutYear);

    return acc;
  }, {});
}

const getPapersForDays = async (days: string[], skip: number = 0, limit: number = -1): Promise<PaperList> => {
  let query = store.papers.findAsync({ date: { $in: days } })
    .sort({ date: 1, id: 1 }); // Sorting by date and then by id
  
  if (limit !== -1) {
    query = query.limit(limit);
  }

  const papers: PaperDocument[] = await query.skip(skip).execAsync();
  
  // Group papers by date
  const groupedPapers: PaperList = days.reduce((acc: PaperList, day: string) => {
    acc[day] = papers.filter(paper => paper.date === day);
    return acc;
  }, {});
  
  return groupedPapers;
};

// const getPapersForDays = async (days: string[], skip: number = 0, limit: number = 5): Promise<PaperList> => {
//   // Fetch papers for the specified days with pagination
//   const papers: PaperDocument[] = await store.papers.findAsync({ date: { $in: days } })
//     .sort({ date: 1, id: 1 }) // Sorting by date and then by id
//     .skip(skip)
//     .limit(limit)
//     .execAsync();
  
//   // Group papers by date
//   const groupedPapers: PaperList = days.reduce((acc: PaperList, day: string) => {
//     acc[day] = papers.filter(paper => paper.date === day);
//     return acc;
//   }, {});
  
//   return groupedPapers;
// };

// const getPapersForDays = async (days: string[]): Promise<PaperList> => {
//   // Fetch papers for the specified days
//   const papers: PaperDocument[] = await store.papers.findAsync({ date: { $in: days } });
  
//   // Group papers by date
//   const groupedPapers: PaperList = days.reduce((acc: PaperList, day: string) => {
//     acc[day] = papers.filter(paper => paper.date === day);
//     return acc;
//   }, {});
  
//   return groupedPapers;
// };

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


export {
  groupByMonth,
  getPapersForDays,
  getStoredDates,
  getLastFiveDaysOfCurrentMonth,
  initializeServer,
}

// database mockup
const days = [ "2021-11-01", "2021-10-31", "2021-10-30" ]
const papers = [ 
  {
    id: '2308.05716',
    date: '2021-10-06',
    // ...
  },
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
      thumbnailUrl: 'thumbnails/230805713', 
    }
  },
]
