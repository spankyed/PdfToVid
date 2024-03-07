import { DateTable } from '../../shared/schema';

//backfill from current date to May 1, 2023
backfillDays('2023-05-01');

async function backfillDays (date: string): Promise<void> {
  const today = new Date();
  const startDay = new Date(date);

  const daysToBackfill = getDaysBetween(startDay.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  const existingDates = await DateTable.findAll({
    where: {
      value: daysToBackfill
    }
  });
  const existingDateValues = existingDates.map(record => record.value);
  const newDates = daysToBackfill.filter(day => !existingDateValues.includes(day));
  const newDateRecords = newDates.map(day => ({
    value: day,
    status: 'pending'
  }));

  if (newDateRecords.length > 0) {
    await DateTable.bulkCreate(newDateRecords, {
      ignoreDuplicates: true // This option depends on your DBMS and Sequelize version
    });
  }

  console.log('Backfill completed.');
};
function getDaysBetween(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: string[] = [];

  while (start < end) {
    // arXiv accepts submissions every day, so we include all days
    days.push(start.toISOString().split('T')[0]);
    start.setDate(start.getDate() + 1);
  }

  return days;
}
