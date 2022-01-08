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
