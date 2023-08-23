import { isLeft } from 'fp-ts/lib/Either';
import { Payload, ReadParams, postDispatcher, read } from './store';
import createServer from '../shared/server';
import { ports } from '../shared/constants';

const serverConfig = { port: ports.database };

const routes = [
  {
    method: 'GET',
    path: '/db',
    handler: async (request, h) => {
      const decoded = ReadParams.decode(request.query);
  
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
      const validationResult = Payload.decode(request.payload);

      if (isLeft(validationResult)) {
        return h.response({ error: 'Invalid data parameters' }).code(400);
      }

      const validPayload = validationResult.right;

      switch (validPayload.operation) {
        case 'create':
          if ('record' in validPayload) {
            return await postDispatcher.create(validPayload);
          }
          break;
        case 'update':
          if ('query' in validPayload && 'updateQuery' in validPayload) {
            return await postDispatcher.update(validPayload);
          }
          break;
        case 'delete':
          if ('query' in validPayload) {
            return await postDispatcher.delete(validPayload);
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
