import { DayDocument } from "../database/schema";

type DayList = {
  month: string;
  days: DayDocument[];
};

function groupDaysByMonth(days: DayDocument[]): DayList[] {
  const grouped: { [key: string]: DayDocument[] } = {};

  for (const day of days) {
    const date = new Date(day.value);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(day);
  }

  const result: DayList[] = Object.keys(grouped).map(month => ({
    month,
    days: grouped[month].sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
  }));

  return result.sort((a, b) => {
    const dateA = new Date(a.days[0].value);
    const dateB = new Date(b.days[0].value);
    return dateB.getTime() - dateA.getTime();
  });
}

export {
  groupDaysByMonth,
}
