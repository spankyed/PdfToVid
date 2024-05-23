import { Request, ResponseToolkit } from '@hapi/hapi';

type RouteHandler = (request: Request, h: ResponseToolkit) => Promise<any>;

export const route = {
  get: (path: string, handler: RouteHandler) => ({ method: 'GET', path, handler }),
  post: (path: string, handler: RouteHandler) => ({ method: 'POST', path, handler }),
}