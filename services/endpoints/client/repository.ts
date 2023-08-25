import { PaperDocument } from '../database/schema';
import { database } from '../shared/integrations';

// type PaperList = {
//   day: string;
//   papers: PaperDocument[];
// };

// ________________________________________________________
function getFiveMostRecentDays(): Promise<any> {
  return database.read({
    table: 'days',
    limit: 5,
    order: { value: -1 }
  });
}

function updateLastRunDay(day: string): Promise<any> {
  return database.update({
    table: 'config',
    query: { lastRun: day },
    updateQuery: { lastRun: day }
  });
}

// async function getPapersForDays(days: string[], skip: number = 0, limit: number = -1): Promise<PaperList[]> {
function getPapersForDays(days: string[], skip: number = 0, limit: number = -1): Promise<any> {
  return database.read({
    table: 'papers',
    query: { value: { $in: days } },
    skip,
    limit,
    // order: { value: 1 }    
  });

  // const groupedPapers: PaperList[] = days.map(day => ({
  //   day,
  //   papers: papers.filter(paper => paper.date === day),
  // }));
  
  // return groupedPapers;
}


// async function getStoredDays(): Promise<DayDocument[]> {
function getStoredDays(): Promise<any> {
  return database.read({ table: 'days' });
}

// async function getLastRunDay(): Promise<string | null> {
function getConfigs(): Promise<any> {
  return database.read({ table: 'config' });
  // return config?.lastRun || null;
}

function storePaper(papers: PaperDocument): Promise<any> {
  return database.create({
    table: 'papers',
    record: papers
  });
}

function storeDay(day: string): Promise<any> {
  return database.create({
    table: 'days',
    record: { value: day, status: 'pending' }
  });
}

async function fetchDashboard(): Promise<any> {
  return Promise.all([
    getStoredDays(), 
    getFiveMostRecentDays()
  ]);
}

export default {
  fetchDashboard,
  storeDay
}
