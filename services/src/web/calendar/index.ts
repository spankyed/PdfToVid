import * as repository from './repository';
import * as sharedRepository from "../../shared/repository";
import { mapRecordsToModel } from './transform';
import { route } from '../../shared/route';


function getCalendar(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const [prevFiveDates, papers] = await repository.fetchCalendarData();
    const calendarModel = mapRecordsToModel(prevFiveDates, papers);
    // ! this being empty shouldn't break the UI for papers in calendar
    resolve(calendarModel) 
  });
}

function loadMore(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.cursor;
    const [prevFiveDates, papers] = await repository.fetchCalendarData(date);
    const calendarModel = mapRecordsToModel(prevFiveDates, papers);
    resolve(calendarModel) 
  });
}

function loadMonth(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.cursor;
    const [prevFiveDates, papers] = await repository.fetchCalendarData(date, true);
    const calendarModel = mapRecordsToModel(prevFiveDates, papers);
    resolve(calendarModel) 
  });
}

function reset(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const success = await sharedRepository.updateDate(date, { status: 'pending' });
    resolve(success) 
  });
}

export default [
  route.get('/getCalendar', getCalendar),
  route.post('/reset/{date}', reset),
  route.get('/loadMore/{cursor}', loadMore),
  route.get('/loadMonth/{cursor}', loadMonth),
]
