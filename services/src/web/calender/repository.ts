import { DateTable, PapersTable } from "../../shared/schema";
import { Sequelize, DataTypes, Op, FindOptions } from 'sequelize';

export const calenderPageSize = 5;

async function fetchCalenderData(afterDate?: string) {
  let queryOptions: FindOptions = {
    raw: true,
    order: [['value', 'DESC']],
    limit: calenderPageSize,
    // attributes: ['value'], // if we only need the 'value' field for the join
  };

  if (afterDate) {
    // If a cursor is provided, adjust the query to fetch records after the cursor
    queryOptions.where = {
      value: {
        [Op.gt]: afterDate,
      },
    };
  }

  const recentDates = await DateTable.findAll(queryOptions);

  const recentDateValues = recentDates.map(date => date.value);

  const papersWithDates = await PapersTable.findAll({
    include: [{
      model: DateTable,
      where: { value: { [Op.in]: recentDateValues } }, // Use [Op.in] for matching any value in the array
      // where: { value: recentDateValues }, // Filters the PapersTable entries to those that match the recent dates
    }],
    order: [['date', 'DESC']], // Ensures papers are sorted by their date
  });

  return [recentDates, papersWithDates];
}

export {
  fetchCalenderData,
}

/**
 * Fetches a page of papers sorted by date for cursor-based pagination.
 * 
 * @param {string|null} lastDateCursor The last date fetched, used as a cursor for pagination. Null for the first page.
 * @param {number} pageSize The number of records to fetch.
 * @param {boolean} [desc=true] Whether to sort in descending order. Default is true.
 * @returns {Promise<Array>} A promise that resolves to an array of papers.
 */
// async function fetchPapersByDate(lastDateCursor: any, pageSize: any, desc = true) {
//   let queryOptions: FindOptions = {
//     raw: true,
//     order: [['date', desc ? 'DESC' : 'ASC']],
//     limit: pageSize,
//     // attributes: ['value'], // if we only need the 'value' field for the join
//   };

//   if (lastDateCursor) {
//     queryOptions.where = {
//       date: {
//         [desc ? Op.lt : Op.gt]: lastDateCursor,
//       },
//     };
//   }

//   return await PapersTable.findAll(queryOptions);
// }
