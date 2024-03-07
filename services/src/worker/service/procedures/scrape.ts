// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw
import * as fs from 'fs';
import scrapePapersByDate from '../functions/scrape-papers-by-date'; // Assume this exists
import { getRelevancyScores } from '../functions/relevancy-compute'; // Assume this exists
import repository from '../repository'; // Assume this exists
import { WebServerPath } from '../../../shared/constants';
import createRequest from '../../../shared/request';

const webService = createRequest(WebServerPath);

const scrapeAndRankPapers = async (date: string) => {
  console.log('Scraping papers...');
  // await repository.updateDayStatus(date, 'complete');

  // await status.set('days', { key: date, status: 'scraping' });
  const papers = await scrapePapersByDate(date);

  if (papers.length === 0) {
    console.log('No papers found for the date:', date);
    return;
  }
  // const pathToLogs = "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/logs";
  // fs.writeFileSync(`${pathToLogs}/${date}.json`, JSON.stringify(papers));

  console.log('Papers scraped, proceeding to ranking...');

  await webService.post(`work-status/days`, { key: date, status: 'ranking'})

  const rankedPapers = await getRelevancyScores(papers);
  const mPapers = rankedPapers.map((p) => ({ 
    ...p,
    date: date,
    status: 0 
  }));

  const sortedPapers = mPapers.sort((a, b) => b.relevancy - a.relevancy);
  
  console.log('Papers ranked, storing papers in DB...');

  await repository.storePapers(sortedPapers.map((p: any) => ({ ...p, authors: p.authors.join('; ') })));

  await repository.updateDayStatus(date, 'complete');
  // await repository.addPapersForDay(date, 'complete');

  await webService.post(`work-status/days`, { key: date, status: 'complete', data: sortedPapers, final: true })

  console.log('Scraping, ranking, and stored for date:', date);
};

export default scrapeAndRankPapers;
