import { CommonAPIErrorResponse } from '@/dto/error';

export * from './parseParam';

export function ensureMethod(actual: string | undefined, expect: string[]) {
  if (!actual || !expect.includes(actual)) {
    const err = new Error(`Expect: [${expect.join(', ')}], actual: ${actual}`);
    err.name = 'Invalid Method';
    throw err;
  }
  console.log('method ensured');
}

export function firstValue<T>(p: T | T[]) {
  return Array.isArray(p) ? p[0] : p;
}

export function raiseError(errResp: CommonAPIErrorResponse) {
  const error = new Error(errResp.desc);
  error.name = errResp.error;
  throw error;
}
