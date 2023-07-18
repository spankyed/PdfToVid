import { chromium, Page } from 'playwright';

interface Entry {
  id: string;
  title: string;
  abstract: string;
  author: { name: string }[];
  pdfLink: string;
  published: string;
}

const extractPaperDetails = async (page: Page): Promise<Entry> => {
  const id = await page.$eval('[name="citation_arxiv_id"]', (node: HTMLMetaElement) => node.content);
  const title = await page.$eval('.title', (node: HTMLElement) => node.textContent?.trim() || '');
  const abstract = await page.$eval('.abstract', (node: HTMLElement) => node.textContent?.trim() || '');
  const author = await page.$$eval('.authors a', (nodes: HTMLElement[]) => nodes.map(n => ({ name: n.textContent?.trim() || '' })));
  const pdfLink = await page.$eval('.full-text a', (node: HTMLAnchorElement) => node.href);
  const published = await page.$eval('[name="citation_date"]', (node: HTMLMetaElement) => node.content);

  return { id, title, abstract, author, pdfLink, published };
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://arxiv.org/list/cs.AI/recent');
  await page.click('a:has-text("all")');
  await page.waitForLoadState('domcontentloaded');

  const dates = await page.$$eval('h3', (nodes: HTMLElement[]) => nodes.map(n => n.textContent || ''));
  const dateIndex = dates.findIndex(date => date === 'Tue, 18 Jul 2023');

  if (dateIndex !== -1) {
    const paperLists = await page.$$('dl');
    const entries = await paperLists[dateIndex].$$eval('dt', (nodes: HTMLElement[]) => nodes.map(n => {
      const links = n.querySelectorAll('a');
      return {
        number: n.textContent || '',
        link: (links[1] as HTMLAnchorElement)?.href || ''
      };
    }));

    for(let entry of entries) {
      await page.goto(entry.link);
      const paperDetails = await extractPaperDetails(page);
      console.log(paperDetails);
    }
  } else {
    console.log('Date not found');
  }

  await browser.close();
})();
