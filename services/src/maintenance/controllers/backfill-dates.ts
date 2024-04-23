import { backfillDates as addDates } from "../scripts/add-dates";
import { route } from '../../shared/route';

function backfillDates(request, h){
  return new Promise(async (resolve, reject) => {
    const { startDate, endDate } = request.payload;

    const newDateRecords = await addDates(startDate, endDate, true);

    resolve(newDateRecords)
  });
}

export default [
  route.post('/backfillDates', backfillDates),
]