import scrapePapersByDate from "./config/scrape-papers-by-date";

function getDatesForMonth(month: number, year: number) {
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1, i + 1)).toUTCString();
    return date.split(' ').slice(0, 4).join(' ');
  });
}

// const dates = getDatesForMonth(8, 2023); // For August 2023
// console.log(dates);

function getTodaysDate() {
  const date = new Date().toUTCString();
  return date.split(' ').slice(0, 4).join(' ');
}

console.log(getTodaysDate());

const testDate = 'Fri, 11 Aug 2023'

scrapePapersByDate(testDate);
// scrapePapersByDate(getTodaysDate());
