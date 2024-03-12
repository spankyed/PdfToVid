import axios from 'axios';
import { io } from "socket.io-client";

// export type Paper = Instance<typeof Paper>;

const apiUrl = 'http://localhost:3000';
export const socket = io(apiUrl);

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

// socket.onAny((event, ...args) => console.log('socket event:', {event}, args));

export const getCalenderData = () => axios.get(apiUrl + '/calender');
export const getPapersForDay = (day) => axios.get(apiUrl + '/papers/' + day);
export const scrapeDay = (date) => axios.post(apiUrl + '/scrape/' + date);
export const backfillToDate = (date) => {
  console.log('backfillToDate: ');
  return axios.post(apiUrl + '/backfill/' + date)
};

// export const checkStatus = async (type, key) => {
//   const maxElapsedTime = 10000; // Maximum time to wait for a response
//   const initialDelay = 8000; // Initial delay time

//   const delayTime = (initial, elapsedTime) => {
//     const nextDelay = Math.min(initial / 2, maxElapsedTime - elapsedTime);
//     return Math.max(nextDelay, 20); // Ensure delay is never less than 20ms
//   };

//   const makeRequest = async (delay, elapsedTime = 0) => {
//     if (elapsedTime >= maxElapsedTime) {
//       throw new Error("Failed to get status update after multiple retries.");
//     }

//     try {
//       const { data } = await axios.post(`${apiUrl}/check-status/${type}`, { key });
//       if (data?.status && data.status.current && data.status.updated) {
//         return data.status;
//       } else {
//         const newDelay = delayTime(delay, elapsedTime);
//         await new Promise(resolve => setTimeout(resolve, newDelay));
//         return makeRequest(newDelay, elapsedTime + newDelay);
//       }
//     } catch (error) {
//       throw new Error(`Error checking status: ${error.message}`);
//     }
//   };

//   return makeRequest(initialDelay);
// };
