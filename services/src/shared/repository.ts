
import { DatesTable, PapersTable } from './schema';
import { ChromaClient } from 'chromadb';
import { createEmbedder } from '~/shared/embedder';
import { ReferenceCollectionName } from './constants';
import { DateRecord, PaperRecord } from './types';

function updateDate(date: string, changes: Partial<DateRecord>): Promise<any> {
  return DatesTable.update(changes, { where: { value: date } });
}

async function storePapers(papers: PaperRecord[]): Promise<any> {
  try {
    const result = await PapersTable.bulkCreate(papers, {
      ignoreDuplicates: true,
      // updateOnDuplicate: ['relevancy']
    });
    return result;
  } catch (error: unknown) {
    console.error('Error occurred during bulk create:', error);

    if (error instanceof Error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        const problematicPapers = papers.filter(async (paper) => {
          const exists = await DatesTable.count({ where: { value: paper.date } });
          return exists === 0;
        });

        console.error('Potential problematic papers:', problematicPapers);
      }
    }

    throw error;
  }
}

const client = new ChromaClient();
let embedder = await createEmbedder();

// const collection = await client.getCollection({ name: 'paper-embeddings', embeddingFunction: embedder });

async function checkForExistingReferenceCollection() {
  const existingCollections = await client.listCollections();

  return existingCollections.map((c) => c.name).includes(ReferenceCollectionName)
}

async function storeReferencePaperChroma(paper: Partial<PaperRecord>) {
  // const embeddings = await embedder.generate([paper.title + ". " + paper.abstract]);
  const collection = await client.getCollection({
    name: ReferenceCollectionName,
    embeddingFunction: embedder
  });

  await collection.add({
    // embeddings: embeddings,
    documents: [paper.title + ". " + paper.abstract],
    ids: [paper.id!],
  });

  return paper.id;
}

let cachedCollection: any = null;

async function getReferenceCollection() {
  if (!cachedCollection) {
    cachedCollection = await client.getCollection({ name: ReferenceCollectionName, embeddingFunction: embedder });
  }
  return cachedCollection;
}

async function addToReferenceCollection(papers: Partial<PaperRecord>[]) {
  const collection = await getReferenceCollection();

  const ids = papers.map(paper => paper.id!);
  const records = {
    ids, 
    documents: papers.map(paper => paper.title + ". " + paper.abstract),
  }

  await collection.add(records);

  return ids;
}

async function initializeReferenceCollection() {
  const collectionExists = await checkForExistingReferenceCollection();

  if (collectionExists) {
    await client.deleteCollection({ name: ReferenceCollectionName });
  }

  await client.createCollection({
    name: ReferenceCollectionName,
    embeddingFunction: embedder,
    metadata: { "hnsw:space": "cosine" }
  });
}

function deleteReferenceCollection() {
  return client.deleteCollection({ name: ReferenceCollectionName });
}

const chroma = {
  storeReferencePaperChroma,
  checkForExistingReferenceCollection,
  getReferenceCollection,
  addToReferenceCollection,
  initializeReferenceCollection,
  deleteReferenceCollection
}

export {
  updateDate,
  storePapers,
  chroma
}