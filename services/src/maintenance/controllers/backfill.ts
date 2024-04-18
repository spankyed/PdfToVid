import { backfillDates } from "../scripts/add-dates";
import { route } from '../../shared/route';

function backfillToDate(request, h){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const newDateRecords = await backfillDates(date);
    
    resolve(newDateRecords)
  });
}

export default [
  route.post('/backfill/{date}', backfillToDate),
]