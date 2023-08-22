import Datastore from '@seald-io/nedb';
import path from 'path';

type DayList = {
  month: string;
  days: DayDocument[];
};

type PaperList = {
  day: string;
  papers: PaperDocument[];
};

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