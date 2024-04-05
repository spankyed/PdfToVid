import * as sharedRepository from '../shared/repository';
import * as repository from './repository';
import { route } from '../../shared/route';

export default [
  route.get('/getDateEntry/{dateId}', getDateEntry),
]

function getDateEntry(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const dateId = request.params.dateId;
    const [date, papers] = await Promise.all([
      repository.getDateByValue(dateId),
      sharedRepository.getPapersByDates([dateId]),
    ]);
    resolve({ papers, date })
  });
}
