import chromadb from "chromadb";
import { pipeline, env } from "@xenova/transformers";
import * as fs from "fs";

const client = new chromadb.ChromaClient();
const COLLECTION_NAME = "paper-embeddings";
const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";
const PATH_REF_PAPERS =
  "/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json";

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

async function storePaperEmbeddingsInChroma(
  papers: any[],
  collectionName = COLLECTION_NAME
) {
  const existingCollections = await client.listCollections();
  console.log('existingCollections: ', existingCollections);
  // if (existingCollections.map((c) => c.name).includes(collectionName)) {
  //   // await client.deleteCollection({ name: COLLECTION_NAME });
  //   await client.createCollection({ name: collectionName, embeddingFunction: embedder });
  // }
  // const embeddings = await embedder.generate(
  //   papers.map((paper) => paper.title + ". " + paper.abstract)
  // );
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });

  await collection.add({
    documents: papers.map((paper) => paper.title + ". " + paper.abstract),
    ids: papers.map((paper) => paper.id),
  });
}

async function fetchAndPrintCollectionContent() {
  embedder = await createSBertEmbeddingFunction(MODEL_NAME);
  const collection = await client.getCollection({ name: COLLECTION_NAME, embeddingFunction: embedder });

  // Assuming there's a method to fetch all documents (or a subset) from the collection
  // const documents = await collection.get();

  // console.log(JSON.stringify(documents, null, 2));

  const refPapers = JSON.parse(fs.readFileSync(PATH_REF_PAPERS, "utf-8"));
  // console.log('refPapers: ', refPapers);
  await storePaperEmbeddingsInChroma(refPapers);

  const documents2 = await collection.get();

  console.log(JSON.stringify(documents2, null, 2));
}

fetchAndPrintCollectionContent();
