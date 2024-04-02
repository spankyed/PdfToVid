import * as repository from './repository';
import { route } from '../../shared/route';

function paperById(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const paperId = request.params.paperId;
    const papers = await repository.getPaperById(paperId);
    resolve(papers)
  });
}

export default [
  route.get('/paperById/{paperId}', paperById),
]
