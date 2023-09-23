import { isLeft } from 'fp-ts/lib/Either';
import { PostPayload, ReadPayload, postDispatcher, preprocessQuery, read } from './store';
import createServer from '../shared/server';
import { ports } from '../shared/constants';

const serverConfig = { port: ports.database };

const routes = [
  {
    method: 'GET',
    path: '/db',
    handler: async (request, h) => {
      const query = preprocessQuery(request.query);
      const decoded = ReadPayload.decode(query);

      if (isLeft(decoded)) {
        return h.response({ error: 'Invalid query parameters' }).code(400);
      }
  
      try {
        const result = await read(decoded.right)();
        if (isLeft(result)) {
          return h.response({ error: result.left.message }).code(400);
        }
        return result.right;
      } catch (error) {
        return h.response({ error: 'An unexpected error occurred' }).code(500);
      }
    }
  },
  {
    method: 'POST',
    path: '/db',
    handler: async (request, h) => {
      // console.log('db request: ', request.payload );
      const validationResult = PostPayload.decode(request.payload);

      if (isLeft(validationResult)) {
        return h.response({ error: 'Invalid data parameters' }).code(400);
      }

      const validPayload = validationResult.right;

      const { operation, ...params } = validPayload

      switch (operation) {
        case 'create':
          if ('record' in params) {
            return await postDispatcher.create(params);
          }
          break;
        case 'update':
          if ('query' in params && 'updateQuery' in params) {
            return await postDispatcher.update(params);
          }
          break;
        case 'delete':
          if ('query' in params) {
            return await postDispatcher.delete(params);
          }
          break;
      }

      return h.response({ error: 'Invalid operation or payload' }).code(400);
    }
  }
];

(async function start () {
  const server = createServer(serverConfig, routes);
  
  try {
    // await server.register(Cors);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Database service running on %s', server.info.uri);
})();
