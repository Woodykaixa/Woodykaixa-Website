export function ensureMethod(actual: string | undefined, expect: string[]) {
  if (!actual || !expect.includes(actual)) {
    const err = new Error(`Expect: [${expect.join(', ')}], actual: ${actual}`);
    err.name = 'Invalid Method';
    throw err;
  }
}

type ParamType = string | string[];
type SchemaType<HttpParamType extends object = {}> = {
  [key in keyof HttpParamType]: (value?: ParamType) => { valid: boolean; parsed: HttpParamType[key] };
};
export async function parseParam<HttpParamType extends object>(
  param: { [key: string]: ParamType | undefined },
  schema: SchemaType<HttpParamType>
): Promise<HttpParamType> {
  const result = {} as HttpParamType;
  for (const key in param) {
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
