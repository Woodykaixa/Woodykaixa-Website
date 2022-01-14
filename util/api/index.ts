import { Err } from '@/dto';
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

export function raiseError(errResp: Err.CommonResp) {
  const error = new Error(errResp.desc);
  error.name = errResp.error;
  throw error;
}

export type TypeOfJson = 'array' | 'boolean' | 'number' | 'object' | 'string' | 'null';

export function isType(param: any, type: TypeOfJson) {
  if (type === 'null') {
    return param === null;
  }
  if (type === 'array') {
    return Array.isArray(param);
  }
  console.log('isType: typeof param', typeof param);
  return typeof param === type;
}
