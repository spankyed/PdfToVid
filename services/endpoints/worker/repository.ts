import { PaperDocument } from '../database/schema';
import { database } from '../shared/integrations';

// type PaperList = {
//   day: string;
//   papers: PaperDocument[];
// };

// function updateLastRunDay(day: string): Promise<any> {
//   return database.update({
//     table: 'config',
//     query: { lastRun: day },
//     updateQuery: { lastRun: day }
//   });
// }

// function getPapersForDays(days: string[], skip: number = 0, limit: number = -1): Promise<any> {
//   return database.read({
//     table: 'papers',
//     query: { value: { $in: days } },
//     skip,
//     limit,
//     // order: { value: 1 }    
//   });
// }


// function getStoredDays(): Promise<any> {
//   return database.read({ table: 'days' });
// }

// function getConfigs(): Promise<any> {
//   return database.read({ table: 'config' });
//   // return config?.lastRun || null;
// }

function storePaper(papers: PaperDocument): Promise<any> {
  return database.create({
    table: 'papers',
    record: papers
  });
}

// function storeDay(day: string): Promise<any> {
//   return database.create({
//     table: 'days',
//     record: { value: day, status: 'pending' }
//   });
// }

export default {
  storeDay,
  getPapersForDays
}
