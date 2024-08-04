import { DatesTable, PapersTable } from "../../shared/schema";
import { Sequelize, DataTypes, Op } from 'sequelize';

type DateInput = string | string[];

function getPapersByDates(
  date: DateInput,
  skip = 0,
  limit: number | null = null
): Promise<any[]> {
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

function getDatesByYear(year: string) {
  return DatesTable.findAll({
    where: {
      value: {
        [Op.startsWith]: year,
      },
    },
    raw: true,
  });
}

export {
  getAllDates,
  getPapersByDates,
  getDatesByYear
}
