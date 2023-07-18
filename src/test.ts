import playwright from 'playwright';

interface Entry {
  id: string;
  title: string;
  abstract: string;
  author: { name: string }[];
  pdfLink: string;
  published: string;
}

(async () => {
  const browser = await playwright['chromium'].launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the URL
  await page.goto('https://arxiv.org/list/cs.AI/recent');

  // Click the anchor tag that contains the text "all"
  await page.click('a:has-text("all")');

  // Wait for navigation
  await page.waitForLoadState('domcontentloaded');

  // Get the <h3> elements (dates)
  const dates = await page.$$eval('h3', nodes => nodes.map(n => n.innerText));

  // Find the index of the date we are interested in
  const dateIndex = dates.findIndex(date => date === 'Mon, 17 Jul 2023');

  // If the date is found
  if (dateIndex !== -1) {
    // Get the <dl> elements (lists of papers)
    const paperLists = await page.$$('dl');

    // Get the <dt> elements (entry numbers) within the <dl> list for the date
    const entryNumbers = await paperLists[dateIndex].$$eval('dt', nodes => nodes.map(n => n.innerText));
    const paperLinks = await paperLists[dateIndex].$$eval('dt a', nodes => nodes.map(n => n.href));

    // Extract details for each paper
    for(let i = 0; i < entryNumbers.length; i++) {
      if (paperLinks[i] === "") {
        continue;
      }
      console.log('paperLinks[i]: ' + i);
      // Navigate to paper's info page
      await page.goto(paperLinks[i]);

      let entry: Entry = {
        id: "",
        title: "",
        abstract: "",
        author: [],
        pdfLink: "",
        published: ""
      };

      // Extract paper details
      entry.id = await page.$eval('[name="citation_arxiv_id"]', node => node.content);
      entry.title = await page.$eval('.title', node => node.textContent.trim());
      entry.abstract = await page.$eval('.abstract', node => node.textContent.trim());
      entry.author = await page.$$eval('.authors a', nodes => nodes.map(n => ({ name: n.textContent.trim() })));
      entry.pdfLink = await page.$eval('.full-text a', node => node.href);
      entry.published = await page.$eval('[name="citation_date"]', node => node.content);

      console.log(entry);
    }
  } else {
    console.log('Date not found');
  }

  await browser.close();
})();
