declare module 'arxiv-api';

interface arxiv {
    search: (searchParams: {
        searchQueryParams: string; 
        sortBy: string; 
        sortOrder: string; 
        start: number, 
        maxResults: number;
    }) => any;
}