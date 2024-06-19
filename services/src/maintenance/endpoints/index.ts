import { route } from '../../shared/route';
import repository from '../repository';
import { scrapeBatch } from '../scripts/scrape-batch';
import { backfillInitialDates, backfillDates } from "../scripts/add-dates";
import { groupDatesByMonth } from '~/web/shared/transform';
import { seedReferencePapers } from "../scripts/seed-reference-papers";
import { setConfigSettings } from "~/shared/utils/set-config";
import runBackgroundScripts from "../background";

function getBatchDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const { cursor, direction } = request.payload;

    const dates = await repository.getBackfillDates({ cursor, direction, count: 45 });
  
    resolve(dates)
  });
}
function loadBatchDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const { start, end } = request.payload;

    const newDateRecords = await backfillDates(start, end);
    const dates = await repository.getPendingDatesBetween(start, end);
  
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

function onboardNewUser(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const form = request.payload.form;
    const { inputIds, config } = form;

    try {
      if (inputIds && inputIds.length) {
        await Promise.all([
          seedReferencePapers(undefined, inputIds),
          backfillInitialDates()
        ])
        // console.log('papers: ', papers);
      } else {
        await backfillInitialDates();
      }

      // todo return dates for current year only instead
      const allDates = await repository.getAllDates();
  
      const dateList = groupDatesByMonth(allDates as any);
      
      setConfigSettings({...config, isNewUser: false })

      runBackgroundScripts();
  
      resolve(dateList)
    } catch (err) {
      console.error('Error onboarding new user: ', err);
      reject(err);
    }
  });
}

export default [
  route.post('/loadBatchDates', loadBatchDates),
  route.post('/getBatchDates', getBatchDates),
  route.post('/scrapeBatch', batchScrape),
  route.post('/onboardNewUser', onboardNewUser),
]
