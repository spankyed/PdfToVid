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

    const { startDate, inputIds, config } = form;

    try {
      if (inputIds && inputIds.length) {
        const papers = await seedReferencePapers(undefined, inputIds);
        // console.log('papers: ', papers);
      }

      await backfillDates(startDate);

      const allDates = await repository.getAllDates();
  
      const dateList = groupDatesByMonth(allDates as any);
      
      const defaultConfig = await getConfig();

      const defaultPrompts = defaultConfig.defaultPromptPresets?.map((preset) => ({
        text: preset,
      }));

      Promise.all([
        repository.addPromptPresets(defaultPrompts),
        setConfigSettings({...config, isNewUser: false })
      ]);

      runBackgroundScripts(true);
  
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
