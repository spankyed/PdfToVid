import axios from 'axios';
import { io } from "socket.io-client";

const apiUrl = 'http://localhost:3000';
export const socket = io(apiUrl);
socket.on('connect', () => console.log('Connected to WebSocket server'));
// socket.onAny((event, ...args) => console.log('socket event:', {event}, args));

// get
export const getDatesSidebarData = () => axios.get(apiUrl + '/getDates');
export const getCalendarModelData = () => axios.get(apiUrl + '/getCalendar');
export const calendarLoadMore = (cursor) => axios.get(apiUrl + '/loadMore/' + cursor);
export const calendarLoadMonth = (cursor) => axios.get(apiUrl + '/loadMonth/' + cursor);
export const getPapersByDate = (date) => axios.get(apiUrl + '/papersByDate/' + date);
// post
export const resetDateStatus = (date) => axios.post(apiUrl + '/reset/' + date);
export const scrapeDate = (date) => axios.post(apiUrl + '/scrape/' + date);
export const backfillToDate = (date) => axios.post(apiUrl + '/backfill/' + date);
