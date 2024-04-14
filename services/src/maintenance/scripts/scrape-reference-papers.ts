import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const ARXIV_API_ENDPOINT = "https://export.arxiv.org/api/query?";
const maxResults = 1000;

interface Paper {
  id: string;
  title: string;
  abstract: string;
  pdfLink: string;
  authors: string[];
}

const createArxivIdQuery = (ids: string[]): string => {
  const idList = ids.join(',');
  return `id_list=${idList}&max_results=${maxResults}`;
};


const extractPaperData = (entry: any): Paper => {
  // console.log('entry: ', entry);
  return {
    id: extractIdFromUrl(entry.id[0]),
    title: entry.title[0],
    abstract: entry.summary[0],
    pdfLink: entry.link.find((link: any) => link.$.title === 'pdf').$.href,
    authors: entry.author.map(
      (author: any) =>
        `${author.name[0]}`
    ),
  };
};

function extractIdFromUrl(url: string): string {
  // Use a regular expression to match the part of the URL after the last slash and before an optional version number
  const match = url.match(/\/([^\/]+?)(v\d+)?$/);
  if (match) {
    return match[1]; // The ID is in the first capturing group
  }
  return ''; // Return an empty string if no match is found
}

export default async function scrapePapersByIds(ids: string[]): Promise<Paper[]> {
  console.log('Fetching papers for IDs: ', ids);
  try {
    const query = createArxivIdQuery(ids);
    const url = ARXIV_API_ENDPOINT + query;
    console.log('URL: ', url);
    const response = await axios.get(url);

    if (response.status !== 200) {
    throw new Error("Error fetching data from ArXiv API endpoint");
    }

    const parsedData = await parseStringPromise(response.data);
    const entries = parsedData.feed.entry || [];
    return entries.map(extractPaperData);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
