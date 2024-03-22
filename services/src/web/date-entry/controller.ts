import * as repository from '../sidebar-dates/repository';

export {
  getDateEntry,
}

function getDateEntry(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const papers = await repository.getPapersByDates([date]);
    resolve(papers)
  });
}
