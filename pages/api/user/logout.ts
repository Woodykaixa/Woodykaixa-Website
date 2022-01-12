import type { NextApiRequest, NextApiResponse } from 'next';
import { JwtConfig } from '@/config/jwt';
import { setCookie, CookieOptions } from '@/util/cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.cookies[JwtConfig.COOKIE_KEY];
  if (auth) {
    setCookie(res, JwtConfig.COOKIE_KEY, auth, {
      ...CookieOptions,
      expires: new Date(Date.now() - 200),
    });
  }
  res.status(200).end();
}
