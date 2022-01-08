import { CommonAPIErrorResponse } from '@/dto/error';
import { MethodNotAllowed } from '../error';
export * from './parseParam';

export async function ensureMethod(actual: string | undefined, expect: string[]): Promise<void> {
  if (!actual || !expect.includes(actual)) {
    throw new MethodNotAllowed();
  }
  return;
}

export function firstValue<T>(p: T | T[]) {
  return Array.isArray(p) ? p[0] : p;
}

export function raiseError(errResp: CommonAPIErrorResponse) {
  const error = new Error(errResp.desc);
  error.name = errResp.error;
  throw error;
}
