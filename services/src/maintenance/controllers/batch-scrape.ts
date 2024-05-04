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
  // const results = [];
  const batchSize = 3; 

  const completedDates = await repository.getDates(dates);
  // results.push(...completedDates);
  const pendingDates = dates.filter(date => !completedDates.map(d => d.value).includes(date));

  for (let i = 0; i < pendingDates.length; i += batchSize) {
    const batch = pendingDates.slice(i, i + batchSize);

    try {
      const batchResults = await Promise.all(batch.map((date: any) => scrapeAndRankPapers(date)));
      // results.push(...batchResults);
    } catch (error) {
      // Log the error and possibly decide whether to continue with the next batch
      console.error(`Error processing batch starting at index ${i}:`, error);
      // Continue processing the rest of the batches even if one fails
    }
  }
  // return results;
}