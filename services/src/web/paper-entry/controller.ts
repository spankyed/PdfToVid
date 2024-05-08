import * as repository from './repository';
import * as sharedRepository from '~/shared/repository';
import { route } from '~/shared/route';
import axios from 'axios';

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

async function fetchPdf(request: any, h: any) {
  const { arxivId } = request.params;
  try {
      const response = await axios.get(`http://export.arxiv.org/pdf/${arxivId}`, {
        responseType: 'stream'
      });

      return h.response(response.data).type('application/pdf');
  } catch (error) {
      console.error('Error fetching PDF from arXiv:', error);
      return h.response('Error fetching PDF').code(500);
  }
}

export default [
  route.get('/fetchPdf/{arxivId}', fetchPdf),
  route.get('/paperById/{paperId}', paperById),
  route.post('/starPaper/{paperId}', starPaper),
  route.post('/updatePaperStatus/{paperId}', updatePaperStatus),
]
