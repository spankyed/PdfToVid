import Hapi from '@hapi/hapi';
import { Payload, ReadParams, postDispatcher, read } from './functions';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { fold, isRight } from 'fp-ts/Either';
import { chain, left, tryCatch } from 'fp-ts/TaskEither';
import { TaskEither, tryCatchK } from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/Either';
const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost',
  });
  const validateOperation = (decodedQuery: t.TypeOf<typeof ReadParams>): E.Either<Error, t.TypeOf<typeof ReadParams>> => {
    const { operation, ...params } = decodedQuery;
    return operation === 'read' 
      ? E.right(params)
      : E.left(new Error('Invalid operation'));
  };
  
  const handleErrors = (error: Error) => h.response({ error: error.message }).code(400);
  const handleSuccess = (result: any) => result;
  
  server.route({
    method: 'GET',
    path: '/db',
    handler: (request, h) => 
      pipe(
        ReadParams.decode(request.query),
        E.chain(validateOperation),
        E.chain(read),
        E.fold(handleErrors, handleSuccess)
      )()
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


