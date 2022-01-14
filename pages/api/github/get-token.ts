import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, Gh, OK } from '@/dto';
import { errorHandler } from '@/util/error';
import { ensureMethod, parseParam } from '@/util/api';

export default function handler(req: NextApiRequest, res: NextApiResponse<Gh.GetTokenResp | Err.CommonResp>) {
  ensureMethod(req.method, ['GET'])
    .then(() =>
      parseParam<Gh.GetTokenDTO>(req.query, {
        code: parseParam.parser.string,
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
        res.status(OK.code).json(json);
      }
    })
    .catch(errorHandler(res));
}
