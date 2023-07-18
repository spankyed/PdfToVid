import playwright, { Page } from 'playwright';

interface Entry {
  id: string;
  title: string;
  abstract: string;
  author: { name: string }[];
  pdfLink: string;
  published: string;
}

interface EntryLink {
  number: string;
  link: string;
}

const extractPaperDetails = async (page: Page, { link }: EntryLink): Promise<Entry> => {
  await page.goto(link);
  const [idHandle, titleHandle, abstractHandle, authorsHandle, pdfLinkHandle, publishedHandle] = await Promise.all([
    page.$('[name="citation_arxiv_id"]'),
    page.$('.title'),
    page.$('.abstract'),
    page.$$('.authors a'),
    page.$('.full-text a'),
    page.$('[name="citation_date"]')
  ]);
  const id = await idHandle?.evaluate((node: any) => node.content);
  const title = await titleHandle?.evaluate((node: any) => node.textContent.trim());
  const abstract = await abstractHandle?.evaluate((node: any) => node.textContent.trim());
  const authors = await Promise.all(authorsHandle.map(handle => handle.evaluate((node: any) => ({ name: node.textContent.trim() }))));
  const pdfLink = await pdfLinkHandle?.evaluate((node: any) => node.href);
  const published = await publishedHandle?.evaluate((node: any) => node.content);
  return { id, title, abstract, author: authors, pdfLink, published } as Entry;
}
(async () => {
  const browser = await playwright['chromium'].launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://arxiv.org/list/cs.AI/recent');
  await page.click('a:has-text("all")');
  await page.waitForLoadState('domcontentloaded');

  const dates = await page.$$eval('h3', nodes => nodes.map(n => n.innerText));
  const dateIndex = dates.findIndex(date => date === 'Tue, 18 Jul 2023');

  if (dateIndex !== -1) {
    const paperLists = await page.$$('dl');
    const entries: EntryLink[] = await paperLists[dateIndex].$$eval('dt', nodes => nodes.map(n => {
      const links = n.querySelectorAll('a');
      return {
        number: n.innerText,
        link: links[1]?.href || ''
      };
    }));

    const paperDetailsPromises = entries.map(entry => extractPaperDetails(page, entry));
    const paperDetails = await Promise.all(paperDetailsPromises);
    console.log(paperDetails);
  } else {
    console.log('Date not found');
  }

  await browser.close();
})();
