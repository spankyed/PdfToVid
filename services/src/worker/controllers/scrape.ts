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

type Notification = {
  key: string;
  status: string;
  data?: any;
  final?: boolean;
};

function notifyClient(shouldNotify: boolean, notification: Notification) {
  if (shouldNotify){
    return webService.post(`work-status/dates`, notification);
  }

  return Promise.resolve();
}

const scrapeAndRankPapers = async (date: string, shouldNotify = true) => {
  try {
    console.log('Scraping papers...', date);
    sharedRepository.updateDateStatus(date, 'scraping')
    notifyClient(shouldNotify, { key: date, status: 'scraping' });

    const papers = await scrapePapersByDate(date);
  
    if (papers.length === 0) {
      throw new Error(`No papers found after scraping`);
    }
  
    console.log('Ranking papers...', date);
    sharedRepository.updateDateStatus(date, 'ranking')
    notifyClient(shouldNotify, { key: date, status: 'ranking' });
  
    const rankedPapers = await getRelevancyScores(papers);
    const paperRecords = rankedPapers.sort((a, b) => b.relevancy - a.relevancy);
    
    console.log('Storing papers in DB...', date);
  
    try {
      Promise.all([
        sharedRepository.storePapers(paperRecords),
        sharedRepository.updateDateStatus(date, 'complete')
      ]);
    } catch (error) {
      console.error(`Error storing papers: ${date}`, error);
  
      throw error
    }

    notifyClient(shouldNotify, { key: date, status: 'complete', data: paperRecords, final: true });
  
    console.log('Scraped, ranked, and stored papers for:', date);
  
    return paperRecords
  } catch (error) {
    console.error('Error scraping/ranking papers for:', date);
  
    // sharedRepository.updateDateStatus(date, 'error')
    sharedRepository.updateDateStatus(date, 'pending')
    notifyClient(shouldNotify, { key: date, status: 'error', data: [], final: true });
    
    // throw error
    return []
  }
};

export default scrapeAndRankPapers;
