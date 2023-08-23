import Hapi from '@hapi/hapi';
// import Cors from '@hapi/cors';

export type Routes = (Hapi.ServerRoute<Hapi.ReqRefDefaults> | Hapi.ServerRoute<Hapi.ReqRefDefaults>[])[]

/**
 * Creates a Hapi server instance with the given configuration and routes.
 * 
 * @param {Hapi.ServerOptions | undefined} config - The server configuration options.
 * @param {Route} routes - An array of route definitions or arrays of route definitions.
 * 
 * @returns {Hapi.Server} - The Hapi server instance.
 * 
 * @example
 * const serverConfig: Hapi.ServerOptions = {
 *   port: 3000,
 *   host: 'localhost',
 *   routes: {
 *     cors: {
 *       origin: ['http://localhost:5173'],
 *       additionalHeaders: ['cache-control', 'x-requested-with']
 *     }
 *   }
 * };
 * 
 * const serverRoutes: Hapi.ServerRoute<Hapi.ReqRefDefaults>[] = [{
 *   method: 'GET',
 *   path: '/status',
 *   handler: (request, h) => {
 *     return 'Hello World';
 *   }
 * }];
 * 
 * const server = createServer(serverConfig, serverRoutes);
 */
export default function createServer(
  config: Hapi.ServerOptions | undefined, 
  routes: Routes
): Hapi.Server {
  const server = Hapi.server({
    ...config,
    host: 'localhost',
  });

  routes.forEach((route: Hapi.ServerRoute<Hapi.ReqRefDefaults> | Hapi.ServerRoute<Hapi.ReqRefDefaults>[]) => {
    server.route(route);
  });

  return server;
}
