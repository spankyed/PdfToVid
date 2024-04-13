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
 * @param isStarred - The new boolean value for the 'isStarred' field.
 * @returns A promise that resolves with the result of the update operation.
 */
function updateIsStarred(id: number, isStarred: boolean): Promise<[affectedCount: number]> {
  return PapersTable.update({ isStarred }, { where: { id } });
}

export {
  getPaperById,
  updateIsStarred
}
