import scrapeAndRankPapers from '~/worker/controllers/scrape';
import { route } from '../../shared/route';
import repository from '../repository';

function scrapeBatch(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const dates = request.payload;
    console.log('dates: ', dates);

    processDates(dates)

    resolve('batch scraping started!')
  });
}

function getBatchDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const { cursor, direction } = request.payload;
    console.log('cursor, direction: ', cursor, direction);

    const dates = await repository.getBackfillDates({ cursor, direction });
  
    resolve(dates)
  });
}

export default [
  route.post('/getBatchDates', getBatchDates),
  route.post('/scrapeBatch', scrapeBatch),
]


async function processDates(dates: any[]) {
  const results = [];
  const batchSize = 3;  // This makes it easy to adjust the batch size if needed

  for (let i = 0; i < dates.length; i += batchSize) {
      // Extract a batch of dates
      const batch = dates.slice(i, i + batchSize);

      try {
          // Process each date in the batch concurrently
          const batchResults = await Promise.all(batch.map((date: any) => scrapeAndRankPapers(date)));
          results.push(...batchResults);
      } catch (error) {
          // Log the error and possibly decide whether to continue with the next batch
          console.error(`Error processing batch starting at index ${i}:`, error);
          // Continue processing the rest of the batches even if one fails
      }
  }
  return results;
}