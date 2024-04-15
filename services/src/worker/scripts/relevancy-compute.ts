import { ChromaClient } from 'chromadb'
import { ReferenceCollectionName } from '../../shared/constants';
import { createEmbedder } from '../../shared/embedder';

const client = new ChromaClient();
const embedder = await createEmbedder();

export async function getRelevancyScores(
  papers: any[],
  nResults = 5
): Promise<any[]> {
  console.log("Starting getRelevancyScores...");

  let existingCollections;
  try {
    existingCollections = await client.listCollections();
  } catch (err) {
    console.error('[ERROR] Unable to list chroma collections, server may be down!');
    return []; // ! should set date status to 'error' here or reset status
  }

  if (!existingCollections.map((c) => c.name).includes(ReferenceCollectionName)) {
    throw new Error(`Collection ${ReferenceCollectionName} does not exist`);
  }


  const collection = await client.getCollection({ name: ReferenceCollectionName, embeddingFunction: embedder });
  console.log("Number of papers:", papers.length);

  // Prepare all texts for querying
  const paperTexts = papers.map((paper) => paper.title + ". " + paper.abstract)
    .slice(0, 125); // ! TODO: Remove this slice

  try {
    // Send all queries at once
    const results = await collection.query({
      queryTexts: paperTexts,
      nResults: nResults,
    });
    // console.log('results: ', results);

    // Map over results and papers to set relevancy properties
    papers.forEach((paper, index) => {
      const relevancyScores = results.distances?.[index]
      ? results.distances?.[index]
      : [];
      // console.log('relevancyScores: ', relevancyScores);
      const avgRelevancy =
        relevancyScores.reduce((a, b) => a + b, 0) /
        (relevancyScores.length || 1);

      paper.relevancy = avgRelevancy ? 1 - avgRelevancy : 0;

      // console.log("Avg Relevancy for paper:", paper.id, "is:", avgRelevancy);
    });
  } catch (err) {
    console.error(err);
  }

  console.log("Completed getRelevancyScores");
  return papers;
}
