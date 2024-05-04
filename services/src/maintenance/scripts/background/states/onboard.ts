import { doesReferenceCollectionExist, seedReferencePapers } from "../seed-reference-papers";

async function onboard() {
  const collectionExists = await doesReferenceCollectionExist();

  if (!collectionExists) {
    await seedReferencePapers();
  }
}

export default onboard
