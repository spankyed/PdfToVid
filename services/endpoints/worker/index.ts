import Hapi from '@hapi/hapi';
import { ports } from '../shared/constants';
import createServer from '../shared/server';

const dispatcher = {
  scrapePapers: async (data) => {
    // For demonstration purposes, we'll just log and return a message.
    console.log('Scraping papers...');

    // ! after scraping papers, we need to send to DB & status service

    return { message: 'Papers scraped successfully!' };
  },
  generateMetadata: async (data) => {
    console.log('Generating metadata...');
    return { message: 'Metadata generated successfully!' };
  },
  generateVideoData: async (data) => {
    console.log('Generating video data...');
    return { message: 'Video data generated successfully!' };
  },
  uploadToYouTube: async (data) => {
    console.log('Uploading to YouTube...');
    return { message: 'Video uploaded to YouTube successfully!' };
  }
};

const serverConfig: Hapi.ServerOptions | undefined = { port: ports.worker };

const routes = [
  {
    method: 'POST',
    path: '/worker/{action}',
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

  console.log('Worker servicerunning at:', server.info.uri);
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
