import { DateTable, PapersTable } from "../../shared/schema";
import { Sequelize, DataTypes, Op } from 'sequelize';

// function getPapersByDates(days: any, skip = 0, limit: number | null = null) {
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


function storeDay(day: any) {
  return DateTable.create({
    value: day,
    status: 'pending'
  });
}

function getStoredDays() {
  return DateTable.findAll({
    raw: true, // This tells Sequelize to return plain objects
  });
}

function getFiveMostRecentDays() {
  return DateTable.findAll({
    limit: 5,
    order: [['value', 'DESC']],
    raw: true, // This tells Sequelize to return plain objects
  });
}

async function fetchCalender() {
  const storedDaysPromise = getStoredDays(); // inefficient to get all the days
  const fiveMostRecentDaysPromise = getFiveMostRecentDays();
  return Promise.all([storedDaysPromise, fiveMostRecentDaysPromise]);
}


export {
  fetchCalender,
  storeDay,
}
