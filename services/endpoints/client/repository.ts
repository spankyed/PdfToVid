import { PaperDocument } from '../database/schema';
import { database } from '../shared/integrations';
// import { RecordTypes } from '../shared/types';

function getFiveMostRecentDays(): Promise<any> {
  return database.read({
    table: 'days',
    limit: 5,
    order: { value: -1 }
  });
}

function getPapersForDays(days: string[], skip: number = 0, limit: number = -1): Promise<PaperDocument[]> {
  return database.read({
    table: 'papers',
    query: { value: { $in: days } },
    skip,
    limit,
    // order: { value: 1 }    
  });
}

function getStoredDays(): Promise<any> {
  return database.read({ table: 'days' });
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
  storeDay,
  getPapersForDays
}
