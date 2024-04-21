import { WorkerPath, MaintenancePath } from "../../shared/constants";
import createRequest from "../../shared/request";
import { route } from '../../shared/route';

const workerService = createRequest(WorkerPath);
const maintenanceService = createRequest(MaintenancePath);

async function scrapePapers(request: any, h: any){
  const date = request.params.date;

  workerService.post('scrape', { date });

  return 'Scraping started';
}

function onboard(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const form = request.payload.form;
    console.log('form: ', form);

    const onboardResult: any = await maintenanceService.post('onboardNewUser', { form });
    console.log('onboardResult: ', onboardResult);
    // const prevFiveDates = newDateRecords.slice(calendarPageSize * -1);
    
    resolve('success')
  });
}


export default [
  route.post('/onboardNewUser', onboard),
  route.post('/scrape/{date}', scrapePapers)
]