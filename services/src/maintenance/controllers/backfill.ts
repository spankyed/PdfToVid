import { backfillDates } from "../scripts/backfill";

function backfillToDate(request, h){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const newDateRecords = await backfillDates(date);
    
    resolve(newDateRecords)
  });
}

export {
  backfillToDate,
}
