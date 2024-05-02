// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw
import * as fs from 'fs';
import scrapePapersByDate from '../scripts/scrape-papers-by-date'; // Assume this exists
import { getRelevancyScores } from '../scripts/relevancy-compute'; // Assume this exists
import repository from '../repository'; // Assume this exists
import * as sharedRepository from '../../shared/repository'; // Assume this exists
import { WebServerPath } from '../../shared/constants';
import createRequest from '../../shared/request';

const webService = createRequest(WebServerPath);

const scrapeAndRankPapers = async (date: string, notifyClient = true) => {
  console.log('Scraping papers...', date);
  // await sharedRepository.updateDateStatus(date, 'complete');

  // await status.set('dates', { key: date, status: 'scraping' });
  const papers = await scrapePapersByDate(date);

  if (papers.length === 0) {
    console.log('No papers found for the date:', date);
  
    if (notifyClient) {
      Promise.all([
        webService.post(`work-status/dates`, { key: date, status: 'complete', data: [], final: true }),
        // sharedRepository.updateDateStatus(date, 'complete'),
      ])
    }

    return;
  }
  // const pathToLogs = "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/logs";
  // fs.writeFileSync(`${pathToLogs}/${date}.json`, JSON.stringify(papers));

  console.log('Papers scraped, proceeding to ranking...');

  if (notifyClient) {
    await webService.post(`work-status/dates`, { key: date, status: 'ranking'})
  }

  const rankedPapers = await getRelevancyScores(papers);
  const paperRecords = rankedPapers.sort((a, b) => b.relevancy - a.relevancy);
  
  console.log('Papers ranked, storing papers in DB...');


  try {
    Promise.all([
      sharedRepository.storePapers(paperRecords),
      sharedRepository.updateDateStatus(date, 'complete')
    ]);
  } catch (error) {
    console.error('Error storing papers:', error);
  }


  // await repository.addPapersForDate(date, 'complete');

  if (notifyClient) {
    await webService.post(`work-status/dates`, { key: date, status: 'complete', data: paperRecords, final: true })
  }

  console.log('Scraping, ranking, and stored for date:', date);

  return paperRecords
};

export default scrapeAndRankPapers;
