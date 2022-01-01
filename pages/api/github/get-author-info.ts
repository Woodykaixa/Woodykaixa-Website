import type { NextApiRequest, NextApiResponse } from 'next';
import { GitHubGetUsersDTO } from '@/dto';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | GitHubGetUsersDTO
    | {
        error: string;
        desc: string;
      }
  >
) {
  fetch('https://api.github.com/users/Woodykaixa', {
    headers: {
      accept: 'application/vnd.github.v3+json',
    },
  })
    .then(r => r.json() as Promise<GitHubGetUsersDTO>)
    .then(json => {
      res.status(200).json(json);
    })
    .catch((err: Error) => {
      res.status(400).json({
        error: err.name,
        desc: err.message,
      });
    });
}
