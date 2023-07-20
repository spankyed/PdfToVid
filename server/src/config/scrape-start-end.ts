import playwright from 'playwright';

(async () => {
  const browser = await playwright['chromium'].launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the URL
  await page.goto('https://arxiv.org/list/cs.AI/recent');

  // Click the anchor tag that contains the text "all"
  await page.click('a:has-text("all")');
  console.log('a: ');

  // Wait for navigation
  // await page.waitForSelector('a:has-text("fewer")');
  await page.waitForLoadState('domcontentloaded');
  console.log('b: ');

  // Get the <h3> elements (dates)
  const dates = await page.$$eval('h3', nodes => nodes.map(n => n.innerText));
  console.log('dates: ', dates);

  // Find the index of the date we are interested in
  const dateIndex = dates.findIndex(date => date === 'Mon, 17 Jul 2023');
  console.log('dateIndex: ', dateIndex);

  // If the date is found`
  if (dateIndex !== -1) {
    // Get the <dl> elements (lists of papers)
    const paperLists = await page.$$('dl');

    // Get the <dt> elements (entry numbers) within the <dl> list for the date
    const entryNumbers = await paperLists[dateIndex].$$eval('dt', nodes => nodes.map(n => n.innerText));

    // Get the beginning and end entry numbers
    const beginningEntryNumber = entryNumbers[0];
    const endEntryNumber = entryNumbers[entryNumbers.length - 1];

    console.log(`Beginning entry number: ${beginningEntryNumber}`);
    console.log(`End entry number: ${endEntryNumber}`);
  } else {
    console.log('Date not found');
  }

  await browser.close();
})();
