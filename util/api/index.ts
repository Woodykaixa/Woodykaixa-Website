import { isNumberObject } from 'util/types';

export function ensureMethod(actual: string | undefined, expect: string[]) {
  if (!actual || !expect.includes(actual)) {
    const err = new Error(`Expect: [${expect.join(', ')}], actual: ${actual}`);
    err.name = 'Invalid Method';
    throw err;
  }
  console.log('method ensured');
}

type ParamType = string | string[];
type ParserResult<T> = { valid: boolean; parsed: T } | Promise<{ valid: boolean; parsed: T }>;
type SchemaType<HttpParamType extends object = {}> = {
  [key in keyof HttpParamType]: (value?: ParamType) => ParserResult<HttpParamType[key]>;
};
export async function parseParam<HttpParamType extends object>(
  param: { [key: string]: ParamType | undefined },
  schema: SchemaType<HttpParamType>
): Promise<HttpParamType> {
  const expected = Object.keys(schema);
  const result = {} as HttpParamType;
  for (const key in param) {
    if (!expected.includes(key)) {
      continue;
    }
    const value = param[key];
    const parser = schema[key as keyof typeof schema];
    const { valid, parsed } = await parser(value);
    if (!valid) {
      const valueLiteral = !value ? 'null' : Array.isArray(value) ? `[${value.join(', ')}]` : value;
      const err = new Error(`parse param ${key} failed: ${Array.isArray(valueLiteral)}`);
      err.name = 'Invalid Parameter';
      throw err;
    }
    result[key as keyof HttpParamType] = parsed;
  }

  return Promise.resolve(result);
}

export function firstValue<T>(p: T | T[]) {
  return Array.isArray(p) ? p[0] : p;
}
