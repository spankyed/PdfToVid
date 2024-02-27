import { groupDaysByMonth, mapPapersToDays } from './service/functions';
import repository from './repository';
import { worker } from './service/integrations';
import { status } from '../shared/integrations';
import { getDashboard, getPapersForDay, scrapePapers } from './service/handlers';

export const routes = [
  {
    method: 'GET',
    path: '/dashboard',
    handler: getDashboard
  },
  // fetch papers for day
  {
    method: 'GET',
    path: '/papers/{date}',
    handler: getPapersForDay
  },
  {
    method: 'POST',
    path: '/scrape/{date}',
    handler: scrapePapers
  },
  {
    method: 'POST',
    path: '/check-status/{type}',
    handler: async (request, h) => {
      const type = request.params.type;
      const statusResponse = await status.check(type, request.payload);
      console.log('status response: ', statusResponse);

      if (!statusResponse){
        return { error: 'Problem checking status' }
      }

      return statusResponse;
    }
  }
];