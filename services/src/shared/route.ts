type RouteHandler = (request: any, h: any) => Promise<any>;

type Route = { method: string; path: string; handler: RouteHandler; };

const constructRoute = (method: string, path: string, handler: RouteHandler): Route => {
  return { method, path, handler }
}

export const route = {
  get: (path: any, handler: any) => constructRoute('GET', path, handler),
  post: (path: any, handler: any) => constructRoute('POST', path, handler),
}