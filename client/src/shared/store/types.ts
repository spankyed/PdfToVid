export type DayStatus = 'pending' | 'scraping' | 'ranking' | 'complete' | 'error';

export interface Day {
  value: string;
  status: DayStatus;
}

export interface DatesList {
  month: string;
  days: Day[];
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
  // video: Video;
  // metadata
  status: number;
  relevancy: number;
  liked: boolean;
  keywords: string[];
}

export interface PapersList {
  day: Day;
  papers: Paper[];
}
