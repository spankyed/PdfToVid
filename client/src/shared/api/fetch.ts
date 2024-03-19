import axios from 'axios';
import { io } from "socket.io-client";

const apiUrl = 'http://localhost:3000';
export const socket = io(apiUrl);
socket.on('connect', () => console.log('Connected to WebSocket server'));
// socket.onAny((event, ...args) => console.log('socket event:', {event}, args));

// export const getCalenderData = () => axios.get(apiUrl + '/calender');
export const getDatesSidebarData = () => axios.get(apiUrl + '/calender');
export const getCalenderGridData = () => axios.get(apiUrl + '/calender');

export const getPapersByDate = (date) => axios.get(apiUrl + '/papersByDate/' + date);
export const scrapeDay = (date) => axios.post(apiUrl + '/scrape/' + date);
export const backfillToDate = (date) => axios.post(apiUrl + '/backfill/' + date);
