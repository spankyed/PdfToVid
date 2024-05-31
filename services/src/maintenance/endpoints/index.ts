import { route } from '../../shared/route';
import repository from '../repository';
import { scrapeBatch } from '../scripts/scrape-batch';
import { backfillDates } from "../scripts/add-dates";
import { groupDatesByMonth } from '~/web/shared/transform';
import { seedReferencePapers } from "../scripts/seed-reference-papers";
import { setConfigSettings } from "~/shared/utils/set-config";
import runBackgroundScripts from "../background";
import { getConfig } from '~/shared/utils/get-config';

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

function onboardNewUser(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const form = request.payload.form;
    const { inputIds, config } = form;

    try {
      // const january1991 = new Date('1991-01-01'); // The year arxiv started
      const january1991 = new Date('2024-01-01'); // The year arxiv started

      if (inputIds && inputIds.length) {
        await Promise.all([
          seedReferencePapers(undefined, inputIds),
          backfillDates(january1991)
        ])
        // console.log('papers: ', papers);
      } else {
        await backfillDates(january1991);
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
  route.post('/backfillDates', datesBackfill),
  route.post('/getBatchDates', getBatchDates),
  route.post('/scrapeBatch', batchScrape),
  route.post('/onboardNewUser', onboardNewUser),
]
