import * as repository from '../sidebar-dates/repository';
import { route } from '../../shared/route';

export default [
  route.get('/papersByDate/{date}', getDateEntry),
]

// fetch papers for date
function getDateEntry(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const papers = await repository.getPapersByDates([date]);
    resolve(papers)
  });
}
