import { PaperRecord, DateRecord } from "../../shared/types";

type DatesByMonth = {
  month: string;
  days: DateRecord[];
};

type DateRow = {
  date: DateRecord;
  papers: PaperRecord[];
};

function groupDatesByMonth(days: DateRecord[]): DatesByMonth[] {
  const grouped: { [key: string]: DateRecord[] } = {};

  for (const day of days) {
    const date = new Date(day.value);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(day);
  }

  const result: DatesByMonth[] = Object.keys(grouped).map(month => ({
    month,
    days: grouped[month].sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
  }));

  return result.sort((a, b) => {
    const dateA = new Date(a.days[0].value);
    const dateB = new Date(b.days[0].value);
    return dateB.getTime() - dateA.getTime();
  });
}

function mapRecordsToModel(days: DateRecord[], papers: PaperRecord[]): DateRow[] {
  const groupedPapers: DateRow[] = days.map(date => ({
    date,
    papers: papers.filter(paper => paper.date === date.value),
  }));
  
  return groupedPapers.sort((a, b) => new Date(b.date.value).getTime() - new Date(a.date.value).getTime());
}

export {
  groupDatesByMonth,
  mapRecordsToModel,
}
