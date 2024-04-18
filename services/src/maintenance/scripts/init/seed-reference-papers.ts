import * as sharedRepository from '~/shared/repository';
import repository from '~/maintenance/repository';
import scrapePapersByIds from "../scrape-papers-by-ids";
import { seedReferencePaperIds } from "~/shared/constants";

// const path =  "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/research-papers.json";
// const refPapers = JSON.parse(fs.readFileSync(path, "utf-8"));
// seedReferencePapersIfNeeded(refPapers, true);
// seedReferencePapersIfNeeded([], true);

export function doesReferenceCollectionExist() {
  return sharedRepository.chroma.checkForExistingReferenceCollection();
}

export async function seedReferencePapers(papers?: any[]) {
  sharedRepository.chroma.initializeReferenceCollection()

  if (!papers || !papers.length) {
    papers = await scrapeAndStoreReferencePapers()
  }

  sharedRepository.chroma.addToReferenceCollection(papers)

  return papers;
}


async function scrapeAndStoreReferencePapers() {
  const referencePapers = await scrapePapersByIds(seedReferencePaperIds);

  const scrapedIds = referencePapers.map(paper => paper.id);
  const datesToStore = referencePapers
    .map(paper => paper.date)
    .filter((date, index, array) => array.indexOf(date) === index); // Remove duplicates

  await repository.storeDates(datesToStore)
  
  Promise.all([
    repository.storeReferencePapers(scrapedIds),
    sharedRepository.storePapers(referencePapers)
  ]);

  return referencePapers;
}