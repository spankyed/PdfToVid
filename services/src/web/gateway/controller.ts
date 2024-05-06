import { WorkerPath, MaintenancePath } from "../../shared/constants";
import createRequest from "../../shared/request";
import { route } from '../../shared/route';
import { mapRecordsToModel } from "../calendar/transform";
import { groupDatesByMonth } from "../shared/transform";

const workerService = createRequest(WorkerPath);
const maintenanceService = createRequest(MaintenancePath);

async function scrapePapers(request: any, h: any){
  const date = request.params.date;

  workerService.post('scrape', { date });

  return 'Scraping started';
}

function backFillDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const backFilledDateList: any = await maintenanceService.post('backfillDates', request.payload);

    resolve({
      records: groupDatesByMonth(backFilledDateList.records),
      newCount: backFilledDateList.newCount
    })
  });
}

function gateway(method: string){
  return (request: any, h: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result: any = await maintenanceService.post(method, request.payload);
        resolve(result)
      } catch (err) {
        console.error('Error in gateway: ', err);
        reject(err);
      }
    });
  }
}


export default [
  route.post('/scrapeBatch', gateway('scrapeBatch')),
  route.post('/getBatchDates', gateway('getBatchDates')),
  route.post('/onboardNewUser', gateway('onboardNewUser')),
  route.post('/scrape/{date}', scrapePapers),
  route.post('/backfillDates', backFillDates)
]
