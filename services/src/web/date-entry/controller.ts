import * as sharedRepository from '../shared/repository';

export {
  getDateEntry,
}

function getDateEntry(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const papers = await sharedRepository.getPapersByDates([date]);
    resolve(papers)
  });
}
