
import { DatesTable } from './schema';

function updateDateStatus(date: string, status: string): Promise<any> {
  return DatesTable.update({ status }, { where: { value: date } });
}

export {
  updateDateStatus,
}
