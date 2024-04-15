import { ChromaClient } from 'chromadb'
import { createEmbedder } from '../../../shared/embedder';
import { ReferenceCollectionName } from '../../../shared/constants';
import * as fs from "fs";

// const path =  "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/research-papers.json";
// const refPapers = JSON.parse(fs.readFileSync(path, "utf-8"));
// createReferenceCollection(refPapers);

export async function createReferenceCollection(
  papers: any[],
  collectionName = ReferenceCollectionName
) {
  const client = new ChromaClient();
  const existingCollections = await client.listCollections();
  const embedder = await createEmbedder();

  console.log('existingCollections: ', existingCollections);

  if (existingCollections.map((c) => c.name).includes(collectionName)) {
    await client.deleteCollection({ name: ReferenceCollectionName });
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