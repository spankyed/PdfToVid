import { route } from '../../shared/route';
import repository from '../repository';
import { scrapeBatch } from '../scripts/scrape-batch';
import { backfillDates as addDates } from "../scripts/add-dates";

function backfillDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const { startDate, endDate } = request.payload;

    const newDateRecords = await addDates(startDate, endDate, true);

    resolve(newDateRecords)
  });
}

function getBatchDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const { cursor, direction } = request.payload;

    const dates = await repository.getBackfillDates({ cursor, direction });
  
    resolve(dates)
  });
}

function batchScrape(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const dates = request.payload;

    scrapeBatch(dates)

    resolve('batch scraping started!')
  });
}

export default [
  route.post('/backfillDates', backfillDates),
  route.post('/getBatchDates', getBatchDates),
  route.post('/scrapeBatch', batchScrape),
]
