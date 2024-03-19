import { PaperDocument, DayDocument } from "../shared/types";

type DatesByMonth = {
  month: string;
  days: DayDocument[];
};

type DateRow = {
  date: DayDocument;
  papers: PaperDocument[];
};

function groupDatesByMonth(days: DayDocument[]): DatesByMonth[] {
  const grouped: { [key: string]: DayDocument[] } = {};

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

function mapRecordsToModel(days: DayDocument[], papers: PaperDocument[]): DateRow[] {
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
