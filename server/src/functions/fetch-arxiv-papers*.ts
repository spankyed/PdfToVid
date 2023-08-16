import { arxivSearch, SortBy, SortOrder, Entry } from '../libs/arxiv-api';
import Datastore from '@seald-io/nedb';
import path from 'path';
import fs from 'fs';

// ! Code does not work, issue authorizing from nodejs

// Define the number of results you want to fetch
const maxResults = 114;

// Define the query
const query = {
  searchQuery: 'all:cs.AI',
  start: 0,
  maxResults,
  sortBy: SortBy.SUBMITTED_DATE,
  sortOrder: SortOrder.DESCENDING
};

// Define the path to the output file
const root = '/Users/spankyed/Develop/Projects/PdfToVid/src/files';
const dbPath = path.join(root, 'database', 'papers.db');
const jsonPath = path.join(root, 'output', 'data', 'papers.json');

// Initialize NeDB
const db = new Datastore({ filename: dbPath, autoload: true });

// Function to fetch data from arXiv and write to a JSON file
async function fetchDataAndWriteToFile(): Promise<Entry[]> {
  const results: Entry[] = await arxivSearch(query);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  return results;
}

// Function to insert data into the database
async function insertToDb(entries: Entry[]) {
  for (const entry of entries) {
    db.insert(entry, (err: Error | null) => {
      if (err) console.error(err);
    });
  }
}

// Fetch data, write to file, and then insert to database
fetchDataAndWriteToFile().then(insertToDb);
