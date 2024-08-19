import { route } from '../../shared/route';
import repository from '../repository';
import * as sharedRepository from '~/shared/repository';
import { scrapeBatch } from '../scripts/scrape-batch';
import { backfillInitialDates, backfillDates } from "../scripts/add-dates";
import { groupDatesByMonth } from '~/web/shared/transform';
import { seedReferencePapers } from "../scripts/seed-reference-papers";
import { setConfigSettings } from "~/shared/utils/set-config";
import runBackgroundScripts from "../background";
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
  const { config } = form;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  await Promise.all([
    sharedRepository.getDatesByYear(currentYear.toString()),
    sharedRepository.chroma.initializeReferenceCollection()
  ])

  setConfigSettings({...config, isNewUser: false })

  // runBackgroundScripts();

  return 'onboarding complete';
}

async function addInitialReferences(request: Request, h: ResponseToolkit) {
  const form = request.payload.form;
  const { inputIds } = form;

  if (inputIds?.length) {
    await seedReferencePapers(undefined, inputIds);
  }

  return 'References seeded!';
}


export default [
  route.post('/loadBatchDates', loadBatchDates),
  route.post('/getBatchDates', getBatchDates),
  route.post('/scrapeBatch', batchScrape),
  // onboarding

  route.post('/addInitialReferences', addInitialReferences),
  route.post('/onboardNewUser', onboardNewUser),
]
