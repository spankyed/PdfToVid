// Assuming PaperRecord matches the structure of your PapersTable model
import { DateTable, PapersTable } from '../shared/schema';
import { PaperRecord } from '../shared/types';

// Fetch all stored dates
function getStoredDates(): Promise<any> {
  return DateTable.findAll();
}

// Fetch all configurations, assuming there's only one config record
// async function getConfigs(): Promise<any> {
//   const configs = await ConfigTable.findAll();
//   return configs.length > 0 ? configs[0] : null;
// }

// Store a single paper
function storePaper(paper: PaperRecord): Promise<any> {
  return PapersTable.create(paper);
}

// Store multiple papers
function storePapers(papers: PaperRecord[]): Promise<any> {
  return PapersTable.bulkCreate(papers);
}

// Update the status of a specific date
function updateDateStatus(date: string, status: string): Promise<any> {
  return DateTable.update({ status }, { where: { value: date } });
}

// Update the last run date in the configuration
// function updateLastRunDate(date: string): Promise<any> {
//   // Assuming there's only one config record, you might need to ensure it exists or create it beforehand
//   return ConfigTable.update({ lastRun: date }, { where: {} }); // Updates all records; adjust if your logic differs
// }

export default {
  // getConfigs,
  storePaper,
  storePapers,
  updateDateStatus,
  // updateLastRunDate
};
