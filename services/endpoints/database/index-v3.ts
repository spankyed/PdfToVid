import Hapi from '@hapi/hapi';
import { Payload, postDispatcher, read } from './functions';
import * as t from 'io-ts';
import { mapLeft } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

const toSingleError = (errors: t.Errors): Error => 
  new Error(errors.map(e => e.message).join('\n'));

const validationToEither = <A>(validation: t.Validation<A>): E.Either<Error, A> => 
  pipe(
    validation,
    mapLeft(toSingleError)
  );

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/db',
    handler: (request, h) => 
      pipe(
        ReadParams.decode(request.query),
        E.chain((decodedQuery: t.TypeOf<typeof ReadParams>) => {
          const { operation, ...params } = decodedQuery;
          return operation === 'read' 
            ? read(params)
            : E.left(new Error('Invalid operation'));
        }),
        E.fold(
          error => () => h.response({ error: error.message }).code(400), // Wrap in a function
          result => () => result  // Wrap in a function
        )
      )()
  });
  const decoded = Payload.decode(request.payload);
  const eitherPayload = validationToEither(decoded);
  
  server.route({
    method: 'POST',
    path: '/db',
    handler: (request, h) => 
      pipe(
        validationToEither(Payload.decode(request.payload)),
        E.chain((decodedPayload: t.TypeOf<typeof Payload>) => {
          const operationFunction = postDispatcher[decodedPayload.operation];
          return operationFunction 
            ? operationFunction(decodedPayload)
            : E.left(new Error('Invalid operation'));
        }),
        E.fold(
          error => () => h.response({ error: error.message }).code(400), // Wrap in a function
          result => () => result  // Wrap in a function
        )
      )()
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();


