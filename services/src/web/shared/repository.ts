import { DatesTable, PapersTable } from "../../shared/schema";
import { Sequelize, DataTypes, Op } from 'sequelize';
import moment from 'moment';

type DateInput = string | string[];

function getPapersByDates(
  date: DateInput,
  skip = 0,
  limit: number | null = null
) {
  const whereClause = Array.isArray(date)
    ? { date: { [Op.in]: date } }
    : { date };

  return PapersTable.findAll({
    where: whereClause,
    offset: skip,
    limit: limit === -1 || limit === null ? undefined : limit,
    raw: true,
  });
}

function getAllDates() {
  return DatesTable.findAll({
    raw: true, // This tells Sequelize to return plain objects
  });
}


async function getDatesByYear(year: string) {
  const existingDates = await DatesTable.findAll({
    where: {
      value: {
        [Op.startsWith]: year,
      },
    },
    raw: true,
  });

  const existingDatesSet = new Set(existingDates.map(date => date.value));

  const allDates = [];
  const startDate = moment(`${year}-01-01`);
  const isCurrentYear = moment().year().toString() === year;
  const endDate = isCurrentYear ? moment().endOf('day') : moment(`${year}-12-31`);

  for (let m = startDate; m.isSameOrBefore(endDate); m.add(1, 'days')) {
    const dateStr = m.format('YYYY-MM-DD');
    const date = { value: dateStr, status: 'pending' };

    // If the date is missing in the database, insert it
    if (!existingDatesSet.has(dateStr)) {
      await DatesTable.create(date);
      allDates.push(date);
    } else {
      allDates.push(existingDates.find(d => d.value === dateStr));
    }
  }

  return allDates;
}

export {
  getAllDates,
  getPapersByDates,
  getDatesByYear
}
