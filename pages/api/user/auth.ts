import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, User } from '@/dto';
import { ensureMethod } from '@/util/api';
import { errorHandler, Unauthorized } from '@/util/error';
import { signJwt, verifyAuth } from '@/lib/jwt';
import { JwtConfig } from '@/config/jwt';
import { setCookie } from '@/util/cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse<User.AuthResp | Err.CommonResp>) {
  ensureMethod(req.method, ['GET'])
    .then(async () => {
      const auth = req.cookies[JwtConfig.COOKIE_KEY];
      if (!auth) {
        throw new Unauthorized();
      }
      const result = verifyAuth(auth);
      const newAuth = signJwt({
        id: result.id,
        email: result.email,
        name: result.name,
        blog: result.blog,
        bio: result.bio,
        admin: result.admin,
        avatar: result.avatar,
        registerAt: result.registerAt,
        isFriend: result.isFriend,
      });
      setCookie(res, JwtConfig.COOKIE_KEY, newAuth);
      res.status(200).json(result);
    })
    .catch(errorHandler(res));
}
