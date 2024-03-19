import * as repository from './repository';
import * as sharedRepository from '../shared/dates/repository';
import { WorkerPath, MaintenancePath } from "../../shared/constants";
import createRequest from "../../shared/request";
import { groupDatesByMonth } from '../shared/dates/transform';
import { mapRecordsToModel } from './transform';

const workerService = createRequest(WorkerPath);
const maintenanceService = createRequest(MaintenancePath);
// workerService.post('generate', params)
// workerService.post('auto', params)

export {
  getCalender,
  scrapePapers,
  initialBackfill
}

function getCalender(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const [lastFiveDays, papers] = await repository.fetchCalenderData();
    const calenderModel = mapRecordsToModel(lastFiveDays, papers);
    
    resolve(calenderModel) // ! this being empty shouldnt break the UI for papers in calender
  });
}

function initialBackfill(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    // console.log('backfill: ', backfill);
    const date = request.params.date;
    const newDateRecords: any = await maintenanceService.post('backfill/' + date);
    const lastFiveDays = newDateRecords.slice(-5)
    console.log('lastFiveDays: ', {lastFiveDays, newDateRecords});

    const sorted = lastFiveDays.sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);
    const papers = await sharedRepository.getPapersByDates(sorted.map((day: { value: any; }) => day.value), 0);
    // const papers = await repository.getPapersByDates(sorted.map(day => day.value), 0, 7);
    console.log('papers fetched');
    // todo current day seems to be off (13th instead of 14th for today)
    const calenderModel = mapRecordsToModel(sorted, papers);
    const dateList = groupDatesByMonth(newDateRecords);
    // ! ensure calenderModel only includes dates in DB
    // const calenderData = { dateList, calenderModel: [] } // ! this being empty shouldnt break the UI for papers in calender
    const calenderData = { dateList, calenderModel }
    
    resolve(calenderData)
  });
}

async function scrapePapers(request: any, h: any){
  const date = request.params.date;

  workerService.post('scrape', { date });

  return 'Scraping started';
}
