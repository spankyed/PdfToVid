import fetch from 'node-fetch';
import { parseStringPromise as parseStringPromisified } from 'xml2js';

export enum SortBy {
  RELEVANCE = 'relevance',
  LAST_UPDATED_DATE = 'lastUpdatedDate',
  SUBMITTED_DATE = 'submittedDate',
}

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

interface SearchParams {
  searchQuery: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  start?: number;
  maxResults?: number;
}

export interface Entry {
  id: string[];
  title: string[];
  summary: string[];
  author: { name: string }[];
  link: { $: string }[];
  published: string[];
  updated: string[];
  category: { $: string }[];
}

const getArxivUrl = ({ searchQuery, sortBy, sortOrder, start = 0, maxResults = 10 }: SearchParams) =>
  `http://export.arxiv.org/api/query?search_query=${searchQuery}&start=${start}&max_results=${maxResults}${sortBy ? `&sortBy=${sortBy}` : ''}${sortOrder ? `&sortOrder=${sortOrder}` : ''}`;

const parseArxivObject = (entry: Entry) => ({
  id: entry.id[0] ?? '',
  title: entry.title[0] ?? '',
  summary: entry.summary[0]?.trim() ?? '',
  authors: entry.author?.map(author => author.name) ?? [],
  links: entry.link?.map(link => link.$) ?? [],
  published: entry.published[0] ?? '',
  updated: entry.updated[0] ?? '',
  categories: entry.category?.map(category => category.$) ?? [],
});

const arxivSearch = async ({ searchQuery, sortBy, sortOrder, start = 0, maxResults = 10 }: SearchParams) => {
  const response = await fetch(getArxivUrl({ searchQuery, sortBy, sortOrder, start, maxResults }));
  console.log('getArxivUrl({ searchQuery, sortBy, sortOrder, start, maxResults }): ', getArxivUrl({ searchQuery, sortBy, sortOrder, start, maxResults }));
  const data = await response.text();
  const parsedData = await parseStringPromisified(data);
  return parsedData.feed.entry?.map(parseArxivObject) ?? [];
};

export {
  arxivSearch,
};
