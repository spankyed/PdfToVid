import axios from 'axios';
import { parseStringPromise } from 'xml2js';

interface Entry {
  id: string;
  title: string;
  abstract: string;
  pdfLink: string;
}

const ARXIV_OAI_ENDPOINT = 'http://export.arxiv.org/oai2?';

const fetchPaperDetails = async (id: string): Promise<Entry> => {
    const query = `verb=GetRecord&identifier=oai:arXiv.org:${id}&metadataPrefix=arXiv`;
    const response = await axios.get(ARXIV_OAI_ENDPOINT + query);

    if (response.status !== 200) {
        throw new Error('Error fetching data from ArXiv OAI endpoint');
    }

    const parsedData = await parseStringPromise(response.data);
    const metadata = parsedData['OAI-PMH'].GetRecord[0].record[0].metadata[0]['arXiv'][0];

    return {
        id: metadata.id[0],
        title: metadata.title[0],
        abstract: metadata.abstract[0],
        pdfLink: `http://arxiv.org/pdf/${metadata.id[0]}.pdf`
    };
};

export default async function fetchPapers(ids: string[]): Promise<Entry[]> {
    return await Promise.all(ids.map(fetchPaperDetails));
}
