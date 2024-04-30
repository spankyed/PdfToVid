import scrapeAndRankPapers from '~/worker/controllers/scrape';
import { route } from '../../shared/route';
import repository from '../repository';

function batchScrape(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const { dates } = request.payload;
    console.log('dates: ', dates);

    // Promise.all(dates.map(async (date: any) => {
    //   const newDateRecords = await scrapeAndRankPapers(date, false);
    //   return newDateRecords;
    // }));

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
  route.post('/batchScrape', batchScrape),
]