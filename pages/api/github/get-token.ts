import type { NextApiRequest, NextApiResponse } from 'next';
import type { CommonAPIErrorResponse, GetTokenDTO, GetTokenResp } from '@/dto';
import { errorHandler } from '@/util/error';
import { ensureMethod, parseParam } from '@/util/api';

export default function handler(req: NextApiRequest, res: NextApiResponse<GetTokenResp | CommonAPIErrorResponse>) {
  ensureMethod(req.method, ['GET'])
    .then(() =>
      parseParam<GetTokenDTO>(req.query, {
        code: param => ({
          valid: !!param && typeof param === 'string',
          parsed: param!,
        }),
      })
    )
    .then(({ code }) => {
      return fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          code,
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
        }),
      });
    })
    .then(r => r.json())
    .then(json => {
      if (json.error) {
        const err = new Error(json.error_description);
        err.name = json.error;
        throw err;
      } else {
        res.status(200).json(json);
      }
    })
    .catch(errorHandler(res));
}
