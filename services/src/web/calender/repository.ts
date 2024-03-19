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


async function fetchCalenderData() {
  const recencyLimit = 5;
  const recentDates = await DateTable.findAll({
    // attributes: ['value'], // if we only need the 'value' field for the join
    limit: recencyLimit,
    order: [['value', 'DESC']],
    raw: true,
  });

  const recentDateValues = recentDates.map(date => date.value);

  const papersWithDates = await PapersTable.findAll({
    include: [{
      model: DateTable,
      where: { value: recentDateValues }, // Filters the PapersTable entries to those that match the recent dates
    }],
    order: [['date', 'DESC']], // Ensures papers are sorted by their date
  });

  return [recentDates, papersWithDates];
}

export {
  fetchCalenderData,
}
