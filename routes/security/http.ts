import type {Request, Response, NextFunction} from 'express';

type JsonPayload = unknown;
type RouteHandler = (req: Request, res: Response) => Promise<JsonPayload> | JsonPayload;

function sendJson(res: Response, payload: JsonPayload) {
  res.type('application/json');
  if (typeof payload === 'string') {
    return res.send(payload);
  }
  return res.send(JSON.stringify(payload));
}

function jsonRoute(handler: RouteHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      sendJson(res, await handler(req, res));
    }
    catch(e) {
      next(e);
    }
  };
}

function successRoute(handler: RouteHandler) {
  return async (req: Request, res: Response) => {
    try {
      sendJson(res, {success: !!await handler(req, res)});
    }
    catch(e) {
      console.log(e);
      sendJson(res, {success: false});
    }
  };
}

module.exports = {sendJson, jsonRoute, successRoute};
