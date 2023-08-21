import Hapi from '@hapi/hapi';
import Datastore from '@seald-io/nedb';
import Boom from '@hapi/boom';

interface UpdateStatusPayload {
  status: string;
}

const db = new Datastore();

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost',
    routes: {
      cors: true
    }
  });

  server.route({
    method: 'GET',
    path: '/scrape-status',
    handler: async (request, h) => {
      try {
        const doc = await db.findOneAsync({ type: 'scrapeStatus' });
        return doc;
      } catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/update-status',
    handler: async (request, h) => {
      try {
        const status = (request.payload as UpdateStatusPayload).status;
        await db.updateAsync({ type: 'scrapeStatus' }, { type: 'scrapeStatus', status }, { upsert: true });
        return { message: 'Status updated' };
      } catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
      }
    },
  });

  await server.start();
  console.log(`DB Service running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
