// Assuming PaperDocument matches the structure of your PapersTable model
import { ConfigTable, DateTable, PapersTable } from '../shared/schema';
import { PaperDocument } from '../shared/types';

// Fetch all stored days
function getStoredDays(): Promise<any> {
  return DateTable.findAll();
}

// Fetch all configurations, assuming there's only one config record
// async function getConfigs(): Promise<any> {
//   const configs = await ConfigTable.findAll();
//   return configs.length > 0 ? configs[0] : null;
// }

// Store a single paper
function storePaper(paper: PaperDocument): Promise<any> {
  return PapersTable.create(paper);
}

// Store multiple papers
function storePapers(papers: PaperDocument[]): Promise<any> {
  return PapersTable.bulkCreate(papers);
}

// Update the status of a specific day
function updateDayStatus(day: string, status: string): Promise<any> {
  return DateTable.update({ status }, { where: { value: day } });
}

// Store a new day
function storeDay(day: string): Promise<any> {
  return DateTable.create({ value: day, status: 'pending' });
}

// Update the last run day in the configuration
// function updateLastRunDay(day: string): Promise<any> {
//   // Assuming there's only one config record, you might need to ensure it exists or create it beforehand
//   return ConfigTable.update({ lastRun: day }, { where: {} }); // Updates all records; adjust if your logic differs
// }

export default {
  getConfigs,
  storeDay,
  storePaper,
  storePapers,
  updateDayStatus,
  updateLastRunDay
};
