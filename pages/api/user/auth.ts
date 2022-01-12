import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, User } from '@/dto';
import { ensureMethod, parseParam, isType } from '@/util/api';
import { errorHandler } from '@/util/error';
import { verifyAuth } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse<User.AuthResp | Err.CommonResp>) {
  console.log(req.query);
  Promise.all([
    parseParam<User.AuthDTO>(req.query, {
      auth: param => ({
        valid: isType(param, 'string') && param!.length > 0,
        parsed: param!,
      }),
    }),
    ensureMethod(req.method, ['GET']),
  ] as const)
    .then(async ([dto]) => {
      const result = verifyAuth(dto.auth);
      res.status(200).json(result);
    })
    .catch(errorHandler(res));
}
