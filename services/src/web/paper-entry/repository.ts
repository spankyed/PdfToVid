import { PapersTable } from "../../shared/schema";

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

export {
  getPaperById,
  updatePaperField
}
