import * as repository from './repository';
import * as sharedRepository from '~/shared/repository';
import { route } from '~/shared/route';

function paperById(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const paperId = request.params.paperId;
    const papers = await repository.getPaperById(paperId);
    resolve(papers)
  });
}

function starPaper(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const paperId = request.params.paperId;
    const isStarred = request.payload.value;

    const result = await repository.updatePaperField(paperId, 'isStarred', isStarred);

    try {
      if (isStarred) {
        const paper = await repository.getPaperById(paperId);
        Promise.all([
          sharedRepository.chroma.storeReferencePaperChroma(paper),
          repository.storeReferencePaper(paperId)
        ]);
      } else {
        Promise.all([
          repository.chroma.deleteReferencePaperChroma(paperId),
          repository.deleteReferencePaper(paperId)
        ]);
      }
    } catch (err) {
      console.error(`Unable to update reference paper ${paperId} - ${isStarred}`, err);
      // if storing fails need to revert the isStarred field
      // await repository.updatePaperField(paperId, 'isStarred', !isStarred);
    }

    resolve(result)
  });
}

function updatePaperStatus(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const paperId = request.params.paperId;
    const status = request.payload.status;

    const papers = await repository.updatePaperField(paperId, 'status', status);
    resolve(papers)
  });
}

export default [
  route.get('/paperById/{paperId}', paperById),
  route.post('/starPaper/{paperId}', starPaper),
  route.post('/updatePaperStatus/{paperId}', updatePaperStatus),
]
