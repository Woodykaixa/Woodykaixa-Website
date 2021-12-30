import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        token: string;
      }
    | {
        error: string;
        desc: string;
      }
  >
) {
  if (req.method !== 'GET') {
    res.status(400).json({
      error: 'Unsupported method',
      desc: 'get-token handler should be invoked by GET method',
    });
    return;
  }
  const code = req.query.code;
  if (!code) {
    throw new Error('code is required');
  }
  fetch('https://github.com/login/oauth/access_token', {
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
  })
    .then(r => r.json())
    .then(json => {
      if (json.error) {
        res.status(200).json({
          error: json.error,
          desc: json.error_description,
        });
      } else {
        res.status(200).json(json);
      }
    })
    .catch((err: Error) => {
      res.status(400).json({
        error: 'Error Occurred',
        desc: err.message,
      });
    });
}
