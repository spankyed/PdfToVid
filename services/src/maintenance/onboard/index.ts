import { backfillDates } from "../scripts/add-dates";
import { route } from '../../shared/route';
import { seedReferencePapers } from "../scripts/seed-reference-papers";
import { setConfig } from "~/shared/utils/set-config";
import { groupDatesByMonth } from "~/web/shared/transform";
import runBackgroundScripts from "../background";
import repository from "../repository";

function onboardNewUser(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const form = request.payload.form;

    const { startDate, inputIds, config } = form;

    try {
      if (inputIds && inputIds.length) {
        const papers = await seedReferencePapers(undefined, inputIds);
        // console.log('papers: ', papers);
      }

      await backfillDates(startDate);

      const allDates = await repository.getAllDates();
  
      const dateList = groupDatesByMonth(allDates as any);
      
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