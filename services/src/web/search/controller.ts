import * as repository from './repository';
import { route } from '../../shared/route';

function searchPapers(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const formData = request.payload;
    console.log('formData: ', formData);
    // const papers = await repository.getPaperById(paperId);
    resolve([])
    // resolve(papers)
  });
}

export default [
  route.post('/searchPapers', searchPapers),
]
