import { GetUserInfoResp } from '@/dto';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | GetUserInfoResp
    | {
        error: string;
        desc: string;
      }
  >
) {
  if (req.method !== 'GET') {
    res.status(400).json({
      error: 'Unsupported method',
      desc: 'this handler should be invoked by GET method',
    });
    return;
  }
  const token = req.query.token;
  if (!token) {
    throw new Error('token is required');
  }
  fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/json',
      Authorization: `token ${token}`,
    },
  })
    .then(r => r.json())
    .then(json => {
      console.log(json);
      res.status(200).json({
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
    .catch((err: Error) => {
      res.status(400).json({
        error: 'Error Occurred',
        desc: err.message,
      });
    });
}
