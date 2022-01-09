import { BadRequest } from '@/util/error';

type ParserResult<T> = { valid: boolean; parsed: T } | Promise<{ valid: boolean; parsed: T }>;

type SchemaType<HttpParamType extends object = {}> = {
  [key in keyof HttpParamType]: (value?: HttpParamType[key]) => ParserResult<HttpParamType[key]>;
};

export async function parseParam<HttpParamType extends object>(
  param: any,
  schema: SchemaType<HttpParamType>
): Promise<HttpParamType> {
  const typedParam = param as HttpParamType;
  const expected = Object.keys(schema);
  const unparsedKeys = new Set(expected);
  const result = {} as HttpParamType;
  for (const key in typedParam) {
    if (!expected.includes(key)) {
      continue;
    }
    const value = typedParam[key];
    const parser = schema[key];
    const { valid, parsed } = await parser(value);
    if (!valid) {
      console.log(key, parsed, valid);
      throw new BadRequest(`param error: ${key}`);
    }
    unparsedKeys.delete(key);
    result[key] = parsed;
  }
  if (unparsedKeys.size) {
    const keys = [] as string[];
    unparsedKeys.forEach(v => {
      keys.push(v);
    });
    throw new BadRequest(`expect this args: ${keys.join(', ')}`);
  }

  return result;
}
