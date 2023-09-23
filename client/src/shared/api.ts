// import { types, Instance, flow } from "mobx-state-tree";
import axios from 'axios';

// export type Paper = Instance<typeof Paper>;

const apiUrl = 'http://localhost:3000/';


export const checkStatus = async (type, key) => {
  const delayTime = (initial, elapsedTime) => {
    const nextDelay = Math.min(initial / 2, 10000 - elapsedTime);
    return Math.max(nextDelay, 20); // Ensure delay is never less than 20ms
  };

  const makeRequest = async (delay, elapsedTime = 0) => {
    // if (elapsedTime >= 10000) {
    //   throw new Error("Failed to get status update after multiple retries.");
    // }

    const { data } = await axios.post(apiUrl + 'check-status/' + type, { key });
    // console.log('response: ', data);
    if (data?.status && data.status.current && data.status.updated) {
      return data.status;
    } else {
      const newDelay = delayTime(delay, elapsedTime);
      await new Promise(resolve => setTimeout(resolve, newDelay));
      // console.log('status:new:delay: ', newDelay);
      return makeRequest(newDelay, elapsedTime + newDelay);
    }
  };

  return makeRequest(8000);
};

export const getDashboardData = () => axios.get(apiUrl + 'dashboard');

export const getPapersForDay = (day) => axios.get(apiUrl + 'papers/' + day);

export const scrapeDay = (date) => axios.post(apiUrl + 'scrape/' + date);
