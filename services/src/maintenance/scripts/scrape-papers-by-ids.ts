import axios from 'axios';
import { PaperRecord } from '~/shared/types';
import { extractPaperData } from '~/shared/utils/extract-paper-data';

const ARXIV_API_ENDPOINT = "https://export.arxiv.org/api/query?";
const maxResults = 1000;



const createArxivIdQuery = (ids: string[]): string => {
  const idList = ids.join(',');
  return `id_list=${idList}&max_results=${maxResults}`;
};


export default async function scrapePapersByIds(ids: string[]): Promise<PaperRecord[]> {
  console.log('Fetching papers for IDs: ', ids);
  try {
    const query = createArxivIdQuery(ids);
    const url = ARXIV_API_ENDPOINT + query;
    const response = await axios.get(url);

    if (response.status !== 200) {
    throw new Error("Error fetching data from ArXiv API endpoint");
    }

    return extractPaperData(response.data, { isStarred: true }); // assumed to be starred
  } catch (err) {
    console.error(err);
    throw err;
  }
}
