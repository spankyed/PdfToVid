import Hapi from '@hapi/hapi';
import { isLeft, isRight } from 'fp-ts/Either';
import { Payload, ReadParams, postDispatcher, read } from './store';

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost',
  });

  server.route({
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
  });
  

  server.route({
    method: 'POST',
    path: '/db',
    handler: async (request, h) => {
      const validationResult = Payload.decode(request.payload);

      if (isRight(validationResult)) {
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
      }

      return h.response({ error: 'Invalid operation or payload' }).code(400);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();


