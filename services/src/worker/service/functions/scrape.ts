// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw
import * as fs from 'fs';
import scrapePapersByDate from './scrape-papers-by-date'; // Assume this exists
import { getRelevancyScores } from './relevancy-compute'; // Assume this exists
import repository from '../repository'; // Assume this exists
import { WebServerPath } from '../../../shared/constants';
import createRequest from '../../../shared/request';

const webService = createRequest(WebServerPath);

export const status = {
  update: (type: any, params: any) => webService.post(`work-status/${type}`, params),
}

const scrapeAndRankPapers = async (date: string) => {
  console.log('Scraping papers...');

  // await status.set('days', { key: date, status: 'scraping' });
  const papers = await scrapePapersByDate(date);

  if (papers.length === 0) {
    console.log('No papers found for the date:', date);
    return;
  }
  const pathToLogs = "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/logs";
  fs.writeFileSync(`${pathToLogs}/${date}.json`, JSON.stringify(papers));
  console.log('Papers scraped, proceeding to ranking...');

   // !
  await status.update('days', { key: date, status: 'ranking' });
  const rankedPapers = await getRelevancyScores(papers);
  const mPapers = rankedPapers.map((p: { metaData: any; }) => ({ ...p, date: date, metaData: { ...p.metaData, status: 0 } }));
  const sortedPapers = mPapers.sort((a, b) => b.metaData.relevancy - a.metaData.relevancy);

  await Promise.all(sortedPapers.map(paper => repository.storePaper(paper)));
  await repository.updateDayStatus(date, 'complete');

   // !
  await status.update('days', { key: date, status: 'complete', data: sortedPapers, final: true });

  console.log('Scraping, ranking, and storing completed for date:', date);
};

export default scrapeAndRankPapers;
