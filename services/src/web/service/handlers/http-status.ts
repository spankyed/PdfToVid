import { cons } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { io } from "../..";
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


async function updateStatus(request, h) {
  const type = request.params.type;
  const { key, status, data, final } = request.payload;

  console.log('updateStatus: ', {type, key, status, data: !!data, final});

  // type Status = { current: string; updated?: boolean; final?: boolean; data?: any };
  // io.to(user).emit('status', { type, key, status, data, final });
  io.emit('day_status', { type, key, status, data, final });

  return h.response({ status: 'success' }).code(200);
}

export {
  updateStatus
}
