import Hapi from '@hapi/hapi';

const dispatcher = {
  scrapePapers: async (data) => {
    // For demonstration purposes, we'll just log and return a message.
    console.log('Scraping papers...');
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


const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost'
  });

  server.route({
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
  });

  await server.start();
  console.log('Worker service running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
