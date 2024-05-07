import { backfillDates } from "../scripts/add-dates";
import { route } from '../../shared/route';
import { seedReferencePapers } from "../scripts/background/utils/seed-reference-papers";
import { setConfig } from "~/shared/utils/set-config";
import { groupDatesByMonth } from "~/web/shared/transform";
import runBackgroundScripts from "../scripts/background";

function onboardNewUser(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const form = request.payload.form;

    const { startDate, inputIds, config } = form;

    try {
      const newDateRecords = await backfillDates(startDate);

      if (inputIds && inputIds.length) {
        const papers = await seedReferencePapers(undefined, inputIds);
        // console.log('papers: ', papers);
      }
  
      const dateList = groupDatesByMonth(newDateRecords as any);
      
      await setConfig({...config, isNewUser: false });

      runBackgroundScripts();
  
      resolve(dateList)
    } catch (err) {
      console.error('Error onboarding new user: ', err);
      reject(err);
    }
  });
}

export default [
  route.post('/onboardNewUser', onboardNewUser),
]