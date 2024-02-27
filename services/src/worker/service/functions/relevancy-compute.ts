import chromadb from "chromadb";
import * as fs from "fs";
import { pipeline, env } from "@xenova/transformers";

env.localModelPath = "/Users/spankyed/develop/projects/all-models";
const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";
const COLLECTION_NAME = "paper-embeddings";
const PATH_REF_PAPERS =
  "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/ref-papers.json";
const client = new chromadb.ChromaClient();

async function createSBertEmbeddingFunction(modelName: string) {
  const extractor = await pipeline("feature-extraction", modelName);

  const generate = async (texts: string[]): Promise<number[][]> => {
    const embeddings: number[][] = await Promise.all(
      texts.map(async (text) => {
        const output = await extractor(text, {
          pooling: "mean",
          normalize: true,
        });
        return Array.from(output.data) as number[];
      })
    );
    return embeddings;
  };

  return { generate };
}

let embedder: { generate: (texts: string[]) => Promise<number[][]> };

createSBertEmbeddingFunction(MODEL_NAME).then((e) => {
  embedder = e;
});

async function storePaperEmbeddingsInChroma(
  papers: any[],
  collectionName = COLLECTION_NAME
) {
  const existingCollections = await client.listCollections();
  if (!existingCollections.map((c) => c.name).includes(collectionName)) {
    await client.createCollection({ name: collectionName, embeddingFunction: embedder });
  }

  const embeddings = await embedder.generate(
    papers.map((paper) => paper.title + ". " + paper.abstract)
  );
  const collection = await client.getCollection({ name: collectionName, embeddingFunction: embedder });

  await collection.add({
    embeddings: embeddings,
    ids: papers.map((paper) => paper.id),
  });
}

export async function getRelevancyScores(
  papers: any[],
  nResults = 5
): Promise<any[]> {
  console.log("Starting getRelevancyScores...");

  const existingCollections = await client.listCollections();
  if (!existingCollections.map((c) => c.name).includes(COLLECTION_NAME)) {
    const refPapers = JSON.parse(fs.readFileSync(PATH_REF_PAPERS, "utf-8"));
    await storePaperEmbeddingsInChroma(refPapers);
  }

  const collection = await client.getCollection({ name: COLLECTION_NAME, embeddingFunction: embedder });
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

      paper.metaData = paper.metaData || {};
      paper.metaData.relevancy = avgRelevancy ? 1 - avgRelevancy : 0;

      // console.log("Avg Relevancy for paper:", paper.id, "is:", avgRelevancy);
    });
  } catch (err) {
    console.error(err);
  }

  console.log("Completed getRelevancyScores");
  return papers;
}
