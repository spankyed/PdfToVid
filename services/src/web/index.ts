import createServer from '../shared/server';
import { WebPath, ports } from '../shared/constants';
import { routes } from './service/routes';
import { Server as IOServer } from 'socket.io';
// import eventHandlers from './service/handlers/socket';

// import mocks from '../../../tests/mocks';
// const { paperList } = mocks;

const server = createServer({
  port: ports.client,
  routes: {
    cors: {
      origin: [WebPath], // allow web requests
      additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
}, routes);

export const io = new IOServer(server.listener, {
  cors: {
    origin: "http://localhost:5173", // Client-side application origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    // allowedHeaders: ["my-custom-header"],
    credentials: true // Allow sending cookies from the client
  }
});

export let user = '';

(async function start () {

  io.on('connection', (socket) => {
    console.log('A user connected by ws!', socket.id);
    user = socket.id;
    // Object.keys(eventHandlers).forEach((event) => {
    //   const handler = eventHandlers[event as keyof typeof eventHandlers] || (() => {});
    //   socket.on(event, handler);
    // });
  });

  try {
    // await server.register(Cors);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Web server running at:', server.info.uri);
})();