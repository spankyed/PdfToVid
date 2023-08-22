const handleOperation = (payload: t.TypeOf<typeof Payload>): TaskEither<Error, any> => {
  switch (payload.operation) {
    case 'create':
      return postDispatcher.create(payload);
    case 'update':
      return postDispatcher.update(payload);
    case 'delete':
      return postDispatcher.delete(payload);
    default:
      return left(new Error('Invalid operation'));
  }
};

const handleResponse = fold(
  (error: Error) => h.response({ error: error.message }).code(400),
  (response: any) => h.response(response)
);


server.route({
  method: 'POST',
  path: '/db',
  handler: async (request, h) => {
    const result = await pipe(
      Payload.decode(request.payload),
      fromEither,
      chain(handleOperation),
      handleResponse
    )();

    return result;
  }
});