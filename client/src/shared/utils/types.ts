export enum PaperState {
  discarded = 0,
  scraped = 1,
  generated = 2,
  uploaded = 3
}

export type DateStatus = 'pending' | 'scraping' | 'ranking' | 'complete' | 'error';

export interface DatesRow {
  month: string;
  dates: Date[];
}

export interface Video {
  title: string;
  description: string;
  thumbnailPrompt: string;
  scriptPrompt: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface Paper {
  id: string;
  date: string;
  title: string;
  abstract: string;
  pdfLink: string;
  authors: string;
  status: number;
  relevancy: number;
  liked: boolean;
  keywords: string[];
}
export interface Date {
  value: string;
  status: DateStatus;
}

export interface DateRow {
  date: Date;
  papers: Paper[];
}

export type CalendarModel = DateRow[];
