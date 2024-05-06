import { route } from '../../shared/route';
import repository from '../repository';
import { scrapeBatch } from '../scripts/scrape-batch';
import { backfillDates } from "../scripts/add-dates";
import { groupDatesByMonth } from '~/web/shared/transform';

function datesBackfill(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const { startDate, endDate } = request.payload;

    const newDateRecords = await backfillDates(startDate, endDate);
    const allDates = await repository.getAllDates();

    resolve({
      newCount: newDateRecords.length,
      dateList: groupDatesByMonth(allDates as any)
    })
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
  route.post('/backfillDates', datesBackfill),
  route.post('/getBatchDates', getBatchDates),
  route.post('/scrapeBatch', batchScrape),
]
