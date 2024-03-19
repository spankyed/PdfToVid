import { DateTable, PapersTable } from "../../shared/schema";
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

export {
  getPapersByDates
}
