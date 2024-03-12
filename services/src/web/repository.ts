import { DateTable, PapersTable } from "../shared/schema";
import { Sequelize, DataTypes, Op } from 'sequelize';

function getFiveMostRecentDays() {
  return DateTable.findAll({
    limit: 5,
    order: [['value', 'DESC']],
    raw: true, // This tells Sequelize to return plain objects
  });
}

// function getPapersForDays(days: any, skip = 0, limit: number | null = null) {
//   return PapersTable.findAll({
//     where: { 
//       // Assuming there's a direct or indirect way to filter papers by 'days'
//       // This may require adjustments based on your schema
//       date: days 
//     },
//     offset: skip,
//     limit: limit === -1 || limit === null ? undefined : limit,
//     // Add order if needed, example: order: [['date', 'ASC']]
//     raw: true, // This tells Sequelize to return plain objects
//   });
// }

type DaysInput = string | string[];

// The function returns a Promise that resolves to an array of PaperDocument objects
  function getPapersForDays(
  days: DaysInput,
  skip = 0,
  limit: number | null = null
): Promise<any[]> {
  const whereClause = Array.isArray(days)
    ? { date: { [Op.in]: days } }
    : { date: days };

  return PapersTable.findAll({
    where: whereClause,
    offset: skip,
    limit: limit === -1 || limit === null ? undefined : limit,
    raw: true,
  });
}

function getStoredDays() {
  return DateTable.findAll({
    raw: true, // This tells Sequelize to return plain objects
  });
}

function storeDay(day: any) {
  return DateTable.create({
    value: day,
    status: 'pending'
  });
}

async function fetchDashboard() {
  const storedDaysPromise = getStoredDays();
  const fiveMostRecentDaysPromise = getFiveMostRecentDays();
  return Promise.all([storedDaysPromise, fiveMostRecentDaysPromise]);
}


export default {
  fetchDashboard,
  storeDay,
  getPapersForDays
}
