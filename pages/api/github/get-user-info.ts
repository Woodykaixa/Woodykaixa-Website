import { Gh, Err, OK } from '@/dto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureMethod, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';

export default function handler(req: NextApiRequest, res: NextApiResponse<Gh.GetUserInfoResp | Err.CommonResp>) {
  ensureMethod(req.method, ['GET'])
    .then(() =>
      parseParam<Gh.GetUserInfoDTO>(req.query, {
        token: parseParam.parser.string,
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
