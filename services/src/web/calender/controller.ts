import * as repository from './repository';
import * as sharedRepository from '../sidebar-dates/repository';
import { WorkerPath, MaintenancePath } from "../../shared/constants";
import createRequest from "../../shared/request";
import { groupDatesByMonth } from '../sidebar-dates/transform';
import { mapRecordsToModel } from './transform';
import { route } from '../../shared/route';
import { calenderPageSize } from './repository';

const workerService = createRequest(WorkerPath);
const maintenanceService = createRequest(MaintenancePath);
// workerService.post('generate', params)
// workerService.post('auto', params)

function getCalender(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const [lastFiveDates, papers] = await repository.fetchCalenderData();
    const calenderModel = mapRecordsToModel(lastFiveDates, papers);
    // ! this being empty shouldn't break the UI for papers in calender
    resolve(calenderModel) 
  });
}
function initialBackfill(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const newDateRecords: any = await maintenanceService.post('backfill/' + date);
    const lastFiveDates = newDateRecords.slice(calenderPageSize * -1);
    const sorted = lastFiveDates.sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);
    const dateList = groupDatesByMonth(newDateRecords); // need to update sidebar date list as well
    const calenderModel = mapRecordsToModel(sorted, []);
    const calenderData = { dateList, calenderModel }
    
    resolve(calenderData)
  });
}

async function scrapePapers(request: any, h: any){
  const date = request.params.date;

  workerService.post('scrape', { date });

  return 'Scraping started';
}

export default [
  route.get('/getCalender', getCalender),
  route.post('/backfill/{date}', initialBackfill),
  route.post('/scrape/{date}', scrapePapers)
]
