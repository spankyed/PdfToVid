import { DateRecord } from "../../shared/types";

type DatesByMonth = {
  month: string;
  dates: DateRecord[];
};

function groupDatesByMonth(dates: DateRecord[]): DatesByMonth[] {
  const grouped: { [key: string]: DateRecord[] } = {};

  for (const nextDate of dates) {
    // Convert the date to UTC and format it
    const date = new Date(nextDate.value + 'T00:00:00Z');
    const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(nextDate);
  }

  const result: DatesByMonth[] = Object.keys(grouped).map(month => ({
    month,
    dates: grouped[month].sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
  }));

  return result.sort((a, b) => {
    const dateA = new Date(a.dates[0].value + 'T00:00:00Z');
    const dateB = new Date(b.dates[0].value + 'T00:00:00Z');
    return dateB.getTime() - dateA.getTime();
  });
}

export {
  groupDatesByMonth,
}
