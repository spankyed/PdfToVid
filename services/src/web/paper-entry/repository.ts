import { Op } from "sequelize";
import { ChromaClient } from 'chromadb'
import { PapersTable, ReferencePapersTable } from "../../shared/schema";
import { ReferenceCollectionName } from "../../shared/constants";
import { createEmbedder } from "../../shared/embedder";
import { PaperRecord } from "../../shared/types";

function getPaperById(id: number): Promise<any> {
  return PapersTable.findOne({
    where: { id },
    raw: true,
  });
}

/**
 * Updates the 'isStarred' status of a paper identified by its ID.
 * 
 * @param id - The ID of the paper to update.
 * @param field - The paper field to update.
 * @param value - The new value for the paper field.
 * @returns A promise that resolves with the result of the update operation.
 */
function updatePaperField(id: number, field: string, value: any): Promise<[affectedCount: number]> {
  return PapersTable.update({ [field]: value }, { where: { id } });
}

async function storeReferencePaper(referencePaperId: string): Promise<any> {
  // First find out whether the record exists and is soft-deleted
  const found = await ReferencePapersTable.findOne({
    where: {
      id: referencePaperId,
      deletedAt: {
        [Op.ne]: null // Looks for a record that is soft deleted
      }
    },
    paranoid: false // Includes soft-deleted records in the search
  });

  if (found) {
    await found.restore(); // soft-deleted, restore it
  } else {
    // create a new record
    return await ReferencePapersTable.create({ id: referencePaperId });
  }
}

export function deleteReferencePaper(id: string): Promise<number> {
  return ReferencePapersTable.destroy({
    where: { id }
  });
}

export {
  storeReferencePaper,
  getPaperById,
  updatePaperField,
  chroma,
}

const chroma = {
  storeReferencePaperChroma,
  deleteReferencePaperChroma
}

const client = new ChromaClient();
let embedder = await createEmbedder();

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

async function deleteReferencePaperChroma(paperId: string) {
  const collection = await client.getCollection({
    name: ReferenceCollectionName,
  });
  await collection.delete({ ids: [paperId] });
}

// async function setupChromaCollection() {
//   const collections = await client.listCollections();
//   if (!collections.map(c => c.name).includes(ReferenceCollectionName)) {
//     await client.createCollection({
//       name: ReferenceCollectionName,
//       embeddingFunction: embedder
//     });
//   }
// }
