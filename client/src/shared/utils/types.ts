export type DayStatus = 'pending' | 'scraping' | 'ranking' | 'complete' | 'error';

export interface DatesList {
  month: string;
  days: Date[];
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
  authors: string[];
  status: number;
  relevancy: number;
  liked: boolean;
  keywords: string[];
}
export interface Date {
  value: string;
  status: DayStatus;
}

export interface DateRow {
  date: Date;
  papers: Paper[];
}

export type CalenderModel = DateRow[];
