import Hapi from '@hapi/hapi';
import { ports } from '../shared/constants';
import createServer from '../shared/server';
import { interpret } from 'xstate';
import { scrapeMachine } from './machine';
import { status } from '../shared/integrations';

const dispatcher = {
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

const serverConfig: Hapi.ServerOptions | undefined = { port: ports.worker };

const routes = [
  {
    method: 'POST',
    path: '/{action}',
    handler: async (request, h) => {
      const action = request.params.action;

      if (dispatcher[action]) {
        try {
          const result = await dispatcher[action](request.payload);
          return h.response(result).code(200);
        } catch (error) {
          return h.response(error.message).code(500);
        }
      } else {
        return h.response('Action not recognized').code(400);
      }
    }
  },
];

(async function start () {
  // initializeServer();
  // todo scrape all dates between last run and today
  // if last run was today, do nothing
  // todo only sync dates up to current date on arxiv
  // ? start interval to scrape new papers every 24 hours?

  const server = createServer(serverConfig, routes);

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Worker service running at:', server.info.uri);
})();


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

// const PaperState = t.keyof({
//   DISCARDED: null,
//   SCRAPED: null,
//   GENERATED: null,
//   UNFINALIZED: null,
//   UPLOADED: null,
// });
