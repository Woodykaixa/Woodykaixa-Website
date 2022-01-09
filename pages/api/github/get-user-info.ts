import { GetUserInfoResp, GetUserInfoDTO, Err, OK } from '@/dto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureMethod, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';

export default function handler(req: NextApiRequest, res: NextApiResponse<GetUserInfoResp | Err.CommonResp>) {
  ensureMethod(req.method, ['GET'])
    .then(() =>
      parseParam<GetUserInfoDTO>(req.query, {
        token: param => ({
          valid: !!param && typeof param === 'string',
          parsed: param!,
        }),
      })
    )
    .then(({ token }) =>
      fetch('https://api.github.com/user', {
        headers: {
          Accept: 'application/json',
          Authorization: `token ${token}`,
        },
      })
    )
    .then(r => r.json())
    .then(json => {
      console.log(json);
      res.status(OK.code).json({
        login: json.login,
        avatar_url: json.avatar_url,
        html_url: json.html_url,
        company: json.company,
        blog: json.blog,
        location: json.location,
        email: json.email,
        bio: json.bio,
        id: json.id,
      });
    })
    .catch(errorHandler(res));
}
