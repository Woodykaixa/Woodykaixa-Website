import type { NextApiRequest, NextApiResponse } from 'next';
import { GitHubGetUsersDTO, Err, OK } from '@/dto';
import { errorHandler } from '@/util/error';

export default function handler(req: NextApiRequest, res: NextApiResponse<GitHubGetUsersDTO | Err.CommonResp>) {
  fetch('https://api.github.com/users/Woodykaixa', {
    headers: {
      accept: 'application/vnd.github.v3+json',
    },
  })
    .then(r => r.json() as Promise<GitHubGetUsersDTO>)
    .then(json => {
      res.status(OK.code).json(json);
    })
    .catch(errorHandler(res));
}
