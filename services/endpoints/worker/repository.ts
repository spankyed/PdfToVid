import { PaperDocument } from '../database/schema';
import { database } from '../shared/integrations';

// function getStoredDays(): Promise<any> {
//   return database.read({ table: 'days' });
// }

function getConfigs(): Promise<any> {
  return database.read({ table: 'config' });
  // return config?.lastRun || null;
}

function storePaper(paper: PaperDocument): Promise<any> {
  return database.create({
    table: 'papers',
    record: paper
  });
}

function storePapers(papers: PaperDocument[]): Promise<any> {
  return database.create({
    table: 'papers',
    record: papers
  });
}

function updateDayStatus(day: string, status: string): Promise<any> {
  console.log('day: ', day);
  return database.update({
    table: 'days',
    query: { value: day },
    updateQuery: { status }
  });
}

function storeDay(day: string): Promise<any> {
  return database.create({
    table: 'days',
    record: { value: day, status: 'pending' }
  });
}

function updateLastRunDay(day: string): Promise<any> {
  return database.update({
    table: 'config',
    query: { lastRun: { $exists: true } },
    updateQuery: { lastRun: day }
  });
}

export default {
  getConfigs,
  storeDay,
  storePaper,
  storePapers,
  updateDayStatus,
  updateLastRunDay
}
