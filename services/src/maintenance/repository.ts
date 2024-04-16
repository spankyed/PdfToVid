// Assuming PaperRecord matches the structure of your PapersTable model
import { DatesTable } from '../shared/schema';

// Fetch all stored dates
function getByDates(dates: string[]) {
  return DatesTable.findAll({
    where: {
      value: dates
    }
  });
}

function bulkCreate(newDateRecords: any) {
  return DatesTable.bulkCreate(newDateRecords, {
    ignoreDuplicates: true // This option depends on your DBMS and Sequelize version
  });
}

function getLatestDate() {
  return DatesTable.findOne({
    order: [['value', 'DESC']]
  });
}

export default {
  getByDates,
  bulkCreate,
  getLatestDate
};
