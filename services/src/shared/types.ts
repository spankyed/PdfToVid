
// export type RecordTypes = DayDocument | PaperDocument | { lastRun: string };
export type DayStatuses = 'pending' | 'scraping' | 'ranking' | 'complete';
export type PaperStatuses = 0 | 1 | 2 | 3;
export type TableTypes = {
  days: DayDocument;
  papers: PaperDocument;
  // config: { lastRun: string };
};

export type DayDocument = {
  value: string;
  status: DayStatuses;
};
export type PaperDocument = {
  id: string;
  date: string;
  title: string;
  abstract: string;
  pdfLink: string; // todo remove property as it can be derived from id
  authors?: string[];
  relevancy: number;
  liked?: boolean;
  keywords?: string[];
  status: PaperStatuses;
  // video?: {
  //   title: string;
  //   description: string;
  //   thumbnailPrompt: string;
  //   scriptPrompt: string;
  //   videoUrl: string;
  //   thumbnailUrl: string;
  // };
};
