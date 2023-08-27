import { interpret } from 'xstate';
import { scrapeMachine } from '../service/machine';
import { status } from '../../shared/integrations';

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
    console.log('Scraping papers...');
    await status.set('days', { key: date, status: 'scraping' });

    const machine = scrapeMachine.withContext({ date: date, papers: [] });
    const scrapeService = interpret(machine)
      // .onTransition(state => console.log('state: ', state.value))
      .onDone(async (doneEv) => {
        console.log('done!', {doneEv})
        await new Promise(resolve => setTimeout(resolve, 4000));
        await status.update('days', { key: date, status: 'complete', data: doneEv.data });
        // update papers in DB
        // update status to complete
      })

    scrapeService.start();
    // ! after scraping papers, we need to send to DB & status service

    return { message: 'Scraping started!' };
  },
  generateMetadata: async (data) => {
    console.log('Generating metadata...');
    return { message: 'Metadata generation started' };
  },
  generateVideoData: async (data) => {
    console.log('Generating video data...');
    return { message: 'Video data generation started' };
  },
  uploadToYouTube: async (data) => {
    console.log('Uploading to YouTube...');
    return { message: 'Video uploaded to YouTube started' };
  }
};