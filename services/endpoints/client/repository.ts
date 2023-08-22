import Datastore from '@seald-io/nedb';
import path from 'path';

const root = '/Users/spankyed/Develop/Projects/PdfToVid/services/files/assets';
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

async function getFiveMostRecentRecords(): Promise<any> {
  return {
    method: 'GET',
    operation: 'read',
    params: {
      limit: 5,
      order: { value: -1 }
    }
  }
}