import { isType } from '.';

type ParserResult<T> = { valid: boolean; parsed: T } | Promise<{ valid: boolean; parsed: T }>;
export type ParamParser<T> = (value?: unknown) => ParserResult<T>;

async function secondaryCheck<T>(
  param: unknown,
  parser: ParamParser<T>,
  secondaryParser: (param: T) => boolean | Promise<boolean>
) {
  const { parsed, valid } = await parser(param);
  if (!valid) {
    return {
      parsed,
      valid,
    };
  }
  return {
    parsed,
    valid: await secondaryParser(parsed),
  };
}

const number: ParamParser<number> = param => ({ valid: isType(param, 'number'), parsed: param as number });

const float: ParamParser<number> = async param => {
  const { parsed, valid } = await number(param);
  if (!valid) {
    return {
      parsed,
      valid,
    };
  }
  return {
    parsed,
    valid: parsed.toString(10).includes('.'),
  };
};

const int: ParamParser<number> = async param => {
  const { parsed, valid } = await number(param);
  if (!valid) {
    return {
      parsed,
      valid,
    };
  }
  return {
    parsed,
    valid: !parsed.toString(10).includes('.'),
  };
};

const intGt: (value: number) => ParamParser<number> = value => async param => {
  return secondaryCheck(param, int, param => param > value);
};

const intGe: (value: number) => ParamParser<number> = value => async param => {
  return secondaryCheck(param, int, param => param >= value);
};

const string: ParamParser<string> = param => {
  return {
    valid: isType(param, 'string'),
    parsed: param as string,
  };
};

const strLengthGt: (len: number) => ParamParser<string> = len => async param => {
  return secondaryCheck(param, string, param => param.length > len);
};

const array: ParamParser<Array<unknown>> = param => {
  return {
    valid: isType(param, 'array'),
    parsed: param as unknown[],
  };
};

const boolean: ParamParser<boolean> = param => {
  return {
    valid: isType(param, 'boolean'),
    parsed: param as boolean,
  };
};

const object: ParamParser<object> = param => {
  return {
    valid: isType(param, 'object'),
    parsed: param as object,
  };
};

export const DefaultParser = {
  int,
  intGt,
  intGe,
  float,
  string,
  strLengthGt,
  array,
  boolean,
  object,
};
