import * as repository from './repository';
import { route } from '../../shared/route';

function searchPapers(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const formData = request.payload.form;
    const papers = await repository.searchPapers(formData);
    resolve(papers)
  });
}

export default [
  route.post('/searchPapers', searchPapers),
]
