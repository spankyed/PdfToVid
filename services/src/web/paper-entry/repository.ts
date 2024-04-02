import { PapersTable } from "../../shared/schema";

function getPaperById(id: number): Promise<any> {
  return PapersTable.findOne({
    where: { id },
    raw: true,
  });
}

export {
  getPaperById
}
