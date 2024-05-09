import { io } from "../server";
import * as repository from './repository';
import { groupDatesByMonth } from "./transform";
import { route } from '../../shared/route';
import { getConfig } from "~/shared/utils/get-config";

// async function checkStatus(request, h) {
//   const status = {
//       current: string;
//       updated: boolean | undefined;
//       data: any;
//   };

//   if (status) {
//     return h.response({ status }).code(200);
//   } else {
//     return h.response({ error: 'No status found' }).code(404);
//   }
// }

function getDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const dates = await repository.getAllDates();
    const dateList = groupDatesByMonth(dates);
    
    resolve(dateList)
  });
}

async function updateStatus(request, h) {
  const type = request.params.type;
  const { key, status, data, final } = request.payload;

  console.log('updateStatus: ', {type, key, status, data: !!data, final});

  // type Status = { current: string; updated?: boolean; final?: boolean; data?: any };
  // io.to(user).emit('status', { type, key, status, data, final });
  io.emit('date_status', { type, key, status, data, final });

  return h.response({ status: 'success' }).code(200);
}

function checkIsNewUser(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const config = await getConfig();
    const isNewUser = config.settings.isNewUser;
    
    resolve(isNewUser)
  });
}

export default [
  route.get('/checkIsNewUser', checkIsNewUser),
  route.get('/getDates', getDates),
  route.post('/work-status/{type}', updateStatus),
]
