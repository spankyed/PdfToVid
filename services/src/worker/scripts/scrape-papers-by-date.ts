import axios from "axios";
import { parseStringPromise } from "xml2js";

const ARXIV_API_ENDPOINT = "https://export.arxiv.org/api/query?";
const maxResults = 1000;

interface Paper {
  id: string;
  title: string;
  abstract: string;
  pdfLink: string;
  authors: string[];
}

const createArxivQuery = (dateString: string): string => {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateString.match(dateRegex);

    if (!match) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD.');
    }

    const [year, month, day] = match.slice(1);
    const formattedDate = `${year}${month}${day}`;

    return `search_query=cat:cs.AI+AND+submittedDate:[${formattedDate}0000+TO+${formattedDate}2359]&start=0&max_results=${maxResults}`;
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

export default async function scrapePapersByDate(date: string): Promise<Paper[]> {
  console.log('date: ', date);
  try {
    const query = createArxivQuery(date);
    const url = ARXIV_API_ENDPOINT + query;
    console.log('url: ', url);
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error("Error fetching data from ArXiv API endpoint");
    }

    const parsedData = await parseStringPromise(response.data);
    const entries = parsedData.feed.entry || [];
    // console.log('entries: ', entries);
    return entries.map(extractPaperData);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function extractIdFromUrl(url: string): string {
  // Use a regular expression to match the part of the URL after the last slash and before an optional version number
  const match = url.match(/\/([^\/]+?)(v\d+)?$/);
  if (match) {
    return match[1]; // The ID is in the first capturing group
  }
  return ''; // Return an empty string if no match is found
}

// Example usage
// scrapePapersByDate('2024-02-21').then(papers => {
//   console.log(papers);
// }).catch(error => {
//   console.error('Error fetching papers:', error);
// });
