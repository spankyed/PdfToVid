import Hapi from '@hapi/hapi';
import Datastore from '@seald-io/nedb';
import Boom from '@hapi/boom';

interface UpdateStatusPayload {
  status: string;
}

const db = new Datastore();

const init = async () => {
  const server = Hapi.server({
    port: 5000,
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


// async function createRecord(table: string, record: string, query: any, projection?: any,): Promise<void> {
//   const existingRecord = await store[table].findOneAsync(query, projection);

//   if (!existingRecord) {
//     await store[table].insertAsync(record);
//   }
// }

// async function getAll(table: string): Promise<any[]> {
//   const docs: any[] = await store[table].findAsync({});
//   return docs;
// }

// async function updateWhere(table: string, query: any, updateQuery: any): Promise<void> {
//   await store[table].updateAsync(query, updateQuery, { upsert: true });
// }

// async function getNMostRecentRecords(table: string, max: number, order = { value: -1 }): Promise<any[]> {
//   // (method) Nedb<any>.findAsync<any>(query: any, projection?: any): Datastore.Cursor<any[]>
//   const recentRecords: any[] = await store[table].findAsync({})
//     .sort(order) // Sorting in descending order based on the value field
//     .limit(max) // Limiting the results to the five most recent entries
//     .execAsync();

//   return recentRecords;
// }

// ```