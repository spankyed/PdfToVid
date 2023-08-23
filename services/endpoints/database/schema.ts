import Datastore from '@seald-io/nedb';
import path from 'path';
import { root } from '../shared/constants';

// type DayList = {
//   month: string;
//   days: DayDocument[];
// };

// type PaperList = {
//   day: string;
//   papers: PaperDocument[];
// };

export type DayDocument = {
  value: string;
  hasBeenScraped: boolean;
};
export type PaperDocument = {
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
export type TableTypes = {
  days: DayDocument;
  papers: PaperDocument;
  config: { lastRun: string };
};
type Store = { [K in keyof TableTypes]: Datastore<TableTypes[K]> };

const dbPath = (name: string) => path.join(root, 'files/database', `${name}.db`);

const store: Store = {
  days: new Datastore<DayDocument>({ filename: dbPath('days'), autoload: true }),
  papers: new Datastore<PaperDocument>({ filename: dbPath('papers'), autoload: true }),
  config: new Datastore<{ lastRun: string }>({ filename: dbPath('config'), autoload: true }),
};

export default function getStore<T extends keyof TableTypes>(table: T): Datastore<TableTypes[T]> {
  return store[table];
}
