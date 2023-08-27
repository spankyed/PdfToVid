// import { types, Instance, flow } from "mobx-state-tree";
import axios from 'axios';

// export type Paper = Instance<typeof Paper>;

function getDashboardData() {
  return axios.get('http://localhost:3000/dashboard')
}

function scrapeDay() {
  return axios.get('http://localhost:3000/scrape')
}

async function checkStatus(callback) {
  let totalElapsedTime = 0;
  let delay = 8000; // start with 8 seconds

  while (totalElapsedTime < 10000) { // while total elapsed time is less than 10 seconds
    try {
      const response = await axios.get('http://localhost:3000/status-check');
      callback(response);
      return response;
    } catch (error) {
      if (totalElapsedTime + delay > 10000) {
        delay = 10000 - totalElapsedTime; // adjust delay to not exceed 10 seconds in total
      }
      totalElapsedTime += delay;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay /= 2; // halve the delay for exponential decrease
    }
  }

  throw new Error("Failed to get status after multiple retries.");
}

export default {
  getDashboardData,
  checkStatus
}
