import scrapeAndRankPapers from './scripts/scrape';

// fetch all papers today
// filter title/abstract by keywords/vector search
// get gpt to video scripts for each paper and metadata 
// generate prompt thumbnail  
// shorten thumbnail prompt with midjourney
// generate thumbnail
// save to flat db for review
// upload to youtube

// const PaperState = t.keyof({
//   DISCARDED: null,
//   SCRAPED: null,
//   GENERATED: null,
//   UNFINALIZED: null,
//   UPLOADED: null,
// });

export default {
  scrape: async ({ date }) => {
    scrapeAndRankPapers(date);

    return { message: 'Scraping started!' };
  },
  // mock implementations
  generateMetadata: async (data: any) => {
    console.log('Generating metadata...');
    return { message: 'Metadata generation started' };
  },
  generateVideoData: async (data: any) => {
    console.log('Generating video data...');
    return { message: 'Video data generation started' };
  },
  uploadToYouTube: async (data: any) => {
    console.log('Uploading to YouTube...');
    return { message: 'Video uploaded to YouTube started' };
  }
};