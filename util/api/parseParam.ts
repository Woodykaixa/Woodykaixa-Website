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
  const result = {} as HttpParamType;
  for (const key in typedParam) {
    if (!expected.includes(key)) {
      continue;
    }
    const value = typedParam[key];
    const parser = schema[key];
    const { valid, parsed } = await parser(value);
    if (!valid) {
      throw new BadRequest(`param error: ${key}`);
    }
    result[key] = parsed;
  }

  return result;
}
