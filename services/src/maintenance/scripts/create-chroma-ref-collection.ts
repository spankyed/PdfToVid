// import chromadb from "chromadb";
import { ChromaClient } from 'chromadb'
import * as fs from "fs";
import { createEmbedder } from "../../shared/embedder";

const client = new ChromaClient();
const COLLECTION_NAME = "paper-embeddings";
const PATH_REF_PAPERS =
  "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/research-papers.json";


async function storePaperEmbeddingsInChroma(
  papers: any[],
  collectionName = COLLECTION_NAME
) {
  const existingCollections = await client.listCollections();
  const embedder = await createEmbedder();

  console.log('existingCollections: ', existingCollections);

  if (existingCollections.map((c) => c.name).includes(collectionName)) {
    await client.deleteCollection({ name: COLLECTION_NAME });
    await client.createCollection({ name: collectionName,
      embeddingFunction: embedder,
      metadata: { "hnsw:space": "cosine" }
    });
  }
  // const embeddings = await embedder.generate(
  //   papers.map((paper) => paper.title + ". " + paper.abstract)
  // );
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embedder,
  });

  await collection.add({
    // embeddings: embeddings,
    documents: papers.map((paper) => paper.title + ". " + paper.abstract),
    ids: papers.map((paper) => paper.id),
  });
}

async function fetchAndPrintCollectionContent() {
  // const collection = await client.getCollection({ name: COLLECTION_NAME });

  // const documents = await collection.get();
  // console.log(JSON.stringify(documents, null, 2));

  const refPapers = JSON.parse(fs.readFileSync(PATH_REF_PAPERS, "utf-8"));
  // console.log('refPapers: ', refPapers);
  await storePaperEmbeddingsInChroma(refPapers);

  console.log('done');

  // const documents2 = await collection.get();

  // console.log(JSON.stringify(documents2, null, 2));
}

fetchAndPrintCollectionContent();
