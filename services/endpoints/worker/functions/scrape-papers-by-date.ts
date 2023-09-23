import axios from "axios";
import { parseStringPromise } from "xml2js";

const ARXIV_OAI_ENDPOINT = "http://export.arxiv.org/oai2?";

interface Paper {
  id: string;
  title: string;
  abstract: string;
  pdfLink: string;
  authors: string[];
}

const constructQuery = (date: string): string => {
  const formattedDate = new Date(date).toISOString().split("T")[0];
  return `verb=ListRecords&from=${formattedDate}&until=${formattedDate}&set=cs&metadataPrefix=arXiv`;
};

const isAIPaper = (record: any): boolean => {
  const categories = record.metadata[0]["arXiv"][0].categories[0].split(" ");
  return categories.includes("cs.AI");
};

const extractPaperData = (record: any): Paper => {
  const metadata = record.metadata[0]["arXiv"];
  return {
    id: metadata[0].id[0],
    title: metadata[0].title[0],
    abstract: metadata[0].abstract[0],
    pdfLink: `http://arxiv.org/pdf/${metadata[0].id[0]}.pdf`,
    authors: metadata[0].authors[0].author.map(
      (author: any) =>
        `${author.keyname[0]} ${author.forenames ? author.forenames[0] : ""}`
    ),
  };
};

export default async function scrapePapersByDate(date: string): Promise<Paper[]> {
  try {
    const response = await axios.get(ARXIV_OAI_ENDPOINT + constructQuery(date));

    if (response.status !== 200) {
      throw new Error("Error fetching data from ArXiv OAI endpoint");
    }

    const parsedData = await parseStringPromise(response.data);

    if (parsedData["OAI-PMH"] && parsedData["OAI-PMH"].error) {
      console.error(
        "Error received from ArXiv OAI endpoint:",
        parsedData["OAI-PMH"].error[0]
      );
      return [];
    }

    return parsedData["OAI-PMH"].ListRecords[0].record
      .filter(isAIPaper)
      .map(extractPaperData);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Example usage
// scrapePapersByDate('2023-09-21').then(papers => {
//   console.log(papers);
// }).catch(error => {
//   console.error('Error fetching papers:', error);
// });
