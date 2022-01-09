import { Err } from '@/dto';
import { NextApiResponse } from 'next';
export class HttpError extends Error {
  public readonly code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = 'HttpError';
  }
}

export class BadRequest extends HttpError {
  constructor(message: string = 'bad request') {
    super(message, 400);
    this.name = 'BadRequest';
  }
}

export class NotFound extends HttpError {
  constructor(message: string = 'not found') {
    super(message, 404);
    this.name = 'NotFound';
  }
}

export class MethodNotAllowed extends HttpError {
  constructor(message: string = 'method not allowed') {
    super(message, 405);
    this.name = 'MessageNotAllowed';
  }
}

export function errorHandler(response: NextApiResponse<Err.CommonResp>) {
  return function (err: any) {
    if (err instanceof Error) {
      response.status(err instanceof HttpError ? err.code : 500).json({
        error: err.name,
        desc: err.message,
      });
    } else {
      response.status(500).json({
        error: Object.toString.call(err),
        desc: err,
      });
    }
  };
}
