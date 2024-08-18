import { route } from '../../shared/route';
import repository from '../repository';
import { scrapeBatch } from '../scripts/scrape-batch';
import { backfillInitialDates, backfillDates } from "../scripts/add-dates";
import { groupDatesByMonth } from '~/web/shared/transform';
import { seedReferencePapers } from "../scripts/seed-reference-papers";
import { setConfigSettings } from "~/shared/utils/set-config";
import runBackgroundScripts from "../background";
import { loadBatchDates, onboard } from '../../../../client/src/shared/api/fetch';
import type { Request, ResponseToolkit } from '@hapi/hapi';

async function getBatchDates(request: Request, h: ResponseToolkit) {
  const { cursor, direction } = request.payload as any;

  const dates = await repository.getBackfillDates({ cursor, direction, count: 45 });

  return h.response(dates);
}

async function loadBatchDates(request: Request, h: ResponseToolkit) {
  const { start, end } = request.payload;

  const newDateRecords = await backfillDates(start, end);
  const dates = await repository.getPendingDatesBetween(start, end);

  return h.response(dates);
}

async function batchScrape(request: Request, h: ResponseToolkit) {
  const dates = request.payload;

  scrapeBatch(dates)

  return 'batch scraping started!';
}

async function onboardNewUser(request: Request, h: ResponseToolkit) {
  const form = request.payload.form;
  const { inputIds, config } = form;

  if (inputIds && inputIds.length) {
    await seedReferencePapers(undefined, inputIds);
  } else {
    await backfillInitialDates();
  }

  const allDates = await repository.getAllDates();

  const dateList = groupDatesByMonth(allDates as any);
  
  setConfigSettings({...config, isNewUser: false })

  runBackgroundScripts();

  return dateList;
}

export default [
  route.post('/loadBatchDates', loadBatchDates),
  route.post('/getBatchDates', getBatchDates),
  route.post('/scrapeBatch', batchScrape),
  // onboarding
  route.post('/onboardNewUser', onboardNewUser),
]
