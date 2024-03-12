import { groupDaysByMonth, mapPapersToDays } from '../utils';
import repository from '../repository';

import { WorkerPath, MaintenancePath } from "../../shared/constants";
import createRequest from "../../shared/request";

const workerService = createRequest(WorkerPath);
const maintenanceService = createRequest(MaintenancePath);
// workerService.post('generate', params)
// workerService.post('auto', params)

export {
  getDashboard,
  getPapersForDay,
  scrapePapers,
  backfill
}

function getDashboard(request, h){
  return new Promise(async (resolve, reject) => {
    const [allDays, lastFiveDays] = await repository.fetchDashboard();
    console.log('dash fetched', lastFiveDays);
    const papers = await repository.getPapersForDays(lastFiveDays.map(day => day.value), 0);
    // const papers = await repository.getPapersForDays(lastFiveDays.map(day => day.value), 0, 7);
    console.log('papers fetched');
    // todo current day seems to be off (13th instead of 14th for today)
    const paperList = mapPapersToDays(lastFiveDays, papers);
    const dateList = groupDaysByMonth(allDays);
    // ! ensure paperList only includes dates in DB
    // const dashboardData = { dateList, paperList: [] } // ! this being empty shouldnt break the UI for papers in dashboard
    const dashboardData = { dateList, paperList }
    
    resolve(dashboardData)
  });
}

function getPapersForDay(request, h){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const papers = await repository.getPapersForDays([date]);
    resolve(papers)
  });
}
function backfill(request, h){
  return new Promise(async (resolve, reject) => {
    // console.log('backfill: ', backfill);
    const date = request.params.date;
    const newDateRecords: any = await maintenanceService.post('backfill/' + date);
    const lastFiveDays = newDateRecords.slice(-5)
    console.log('lastFiveDays: ', {lastFiveDays, newDateRecords});

    const sorted = lastFiveDays.sort((a, b) => b.value - a.value);
    const papers = await repository.getPapersForDays(sorted.map(day => day.value), 0);
    // const papers = await repository.getPapersForDays(sorted.map(day => day.value), 0, 7);
    console.log('papers fetched');
    // todo current day seems to be off (13th instead of 14th for today)
    const paperList = mapPapersToDays(sorted, papers);
    const dateList = groupDaysByMonth(newDateRecords);
    // ! ensure paperList only includes dates in DB
    // const dashboardData = { dateList, paperList: [] } // ! this being empty shouldnt break the UI for papers in dashboard
    const dashboardData = { dateList, paperList }
    
    resolve(dashboardData)
  });
}

async function scrapePapers(request, h){
  const date = request.params.date;

  workerService.post('scrape', { date });

  return 'Scraping started';
}

