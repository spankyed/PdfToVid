import { interpret } from 'xstate';
import { scrapeMachine } from './machine';
import { status } from '../../shared/integrations';
import repository from '../repository';

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
    const statusSetSuccess = await status.set('days', { key: date, status: 'scraping' });
    // const statusSetSuccess = await Promise.all([
    //   repository.updateDayStatus(date, 'scraping'),
    //   status.set('days', { key: date, status: 'scraping' }),
    // ])
    
    console.log('DB and status set: ', statusSetSuccess);

    const machine = scrapeMachine.withContext({ date: date, papers: [] });
    const scrapeService = interpret(machine)
      .onTransition(async (state, { data }) => {
        console.log('state: ', state.value)
        if (state.value === 'ranking') {
          await status.update('days', { key: date, status: 'ranking' });
          // const statusSetSuccess = await Promise.all([
          //   repository.updateDayStatus(date, 'scraping'),
          //   status.update('days', { key: date, status: 'ranking' })
          // ])
        }
      })
      .onDone(async ({data}) => {
        console.log('done!', data)
        await new Promise(resolve => setTimeout(resolve, 4000));

        // const dayPapers = {
        //   day: { value: date, status: 'complete' },
        //   papers: data,
        // }

        // await Promise.all([
        //   repository.storePapers(data),
        //   repository.updateDayStatus(date, 'complete'),
        //   status.set('days', { key: date, status: 'complete', data: dayPapers, final: true }),
        // ])

        const papers = data.map(p => ({ ...p, date: date, metaData: { ...p.metaData, status: 0 } }));
        const orderedPapers = papers.sort((a, b) => b.metaData.relevancy - a.metaData.relevancy); // order by relevancy

        await status.update('days', { key: date, status: 'complete', data: orderedPapers, final: true });
      })

    scrapeService.start();

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