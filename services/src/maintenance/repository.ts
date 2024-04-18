// Assuming PaperRecord matches the structure of your PapersTable model
import { DatesTable, ReferencePapersTable } from '../shared/schema';


// Fetch all stored dates
function getByDates(dates: string[]) {
  return DatesTable.findAll({
    where: {
      value: dates
    }
  });
}

async function getLatestDate() {
  const lastDateRecord =  await DatesTable.findOne({
    order: [['value', 'DESC']]
  });


  return lastDateRecord ? lastDateRecord.value : null;
}

async function storeDate(date: string) {
  const existingDate = await DatesTable.findOne({
    where: {
      value: date
    }
  });

  if (!existingDate) {
    await DatesTable.create({ value: date, status: 'pending' });
  }
}

async function storeDates(dates: string[]) {
  const newDateRecords = dates.map(date => ({
    value: date,
    status: 'pending'
  }));

  if (newDateRecords.length > 0) {
    await DatesTable.bulkCreate(newDateRecords, {
      ignoreDuplicates: true // This option depends on your DBMS and Sequelize version
    });
  }

  return newDateRecords;
}

function storeReferencePapers(paperIds: string[]): Promise<any> {
  const referenceRecords = paperIds.map(id => ({ id }));

  return ReferencePapersTable.bulkCreate(referenceRecords);
}

export default {
  getByDates,
  getLatestDate,
  storeDate,
  storeDates,
  storeReferencePapers
};

