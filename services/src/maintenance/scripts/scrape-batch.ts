import scrapeAndRankPapers from '~/worker/controllers/scrape';
import repository from '../repository';
import { notifyClient } from '~/shared/status';

export async function scrapeBatch(dates: any[]) {
  // const results = [];
  const batchSize = 3; 

  const completedDates = await repository.getDates(dates, 'complete');
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

  notifyClient({ key: 'batch', status: 'complete' });
  // return results;
}