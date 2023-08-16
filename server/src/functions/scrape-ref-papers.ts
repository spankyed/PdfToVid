import { chromium, Page, BrowserContext } from 'playwright';

interface Entry {
  id: string;
  title: string;
  abstract: string;
  author: { name: string }[];
  pdfLink: string;
  published: string;
}

const extractPaperDetails = async (context: BrowserContext, link: string): Promise<Entry> => {
  const page = await context.newPage();
  await page.goto(link);
  
  const id = await page.$eval('[name="citation_arxiv_id"]', (node: HTMLMetaElement) => node.content);
  const title = await page.$eval('.title', (node: HTMLElement) => 
    node.textContent?.replace("Title:", "").trim() || ''); // remove "Title:" from title
  const abstract = await page.$eval('.abstract', (node: HTMLElement) => 
    node.textContent?.replace("Abstract:", "").trim() || ''); // remove "Abstract:" from abstract
  const author = await page.$$eval('.authors a', (nodes: HTMLElement[]) => nodes.map(n => ({ name: n.textContent?.trim() || '' })));

  // const pdfLink = await page.$eval('.full-text a', (node: HTMLAnchorElement) => node.href);
  // https://arxiv.org/pdf/2308.05713.pdf
  const pdfLink = `https://arxiv.org/pdf/${id}.pdf`
  
  const published = await page.$eval('[name="citation_date"]', (node: HTMLMetaElement) => node.content);

  await page.close();

  // return { id, title, abstract, author, pdfLink, published };
  return { id, title, abstract, pdfLink };
};

export default async function scrapeRefPapers(ids: string[]) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  let paperDetails: Entry[] = [];

  const page = await context.newPage();

  const links = ids.map(id => `https://arxiv.org/abs/${id}`);

  const paperDetailsPromises = links.map(link => extractPaperDetails(context, link));
  paperDetails = await Promise.all(paperDetailsPromises);

  await browser.close();

  return paperDetails
};
