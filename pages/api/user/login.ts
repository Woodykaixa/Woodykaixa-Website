import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Err, OK, User } from '@/dto';
import { ensureMethod, parseParam, isType } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import { UserService, AvatarService } from '@/lib/services';
import { signJwt } from '@/lib/jwt';
import { JwtConfig } from '@/config/jwt';
import { setCookie } from '@/util/cookie';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse<User.LoginResp | Err.CommonResp>) {
  Promise.all([
    parseParam<User.LoginDTO>(req.body, {
      email: parseParam.parser.string,
      password: parseParam.parser.string,
    }),
    prismaClient.$connect(),
    ensureMethod(req.method, ['POST']),
  ] as const)
    .then(async ([dto]) => {
      const user = await UserService.findByEmail(prismaClient, dto.email);
      if (!user) {
        throw new BadRequest(Err.User.NOT_EXISTS);
      }
      if (!bcrypt.compareSync(dto.password, user.password)) {
        throw new BadRequest(Err.User.WRONG_PASSWORD);
      }
      return user;
    })
    .then(async user => {
      const avatar = await AvatarService.getAvatarById(prismaClient, user.avatarIds[0]);
      const resp = {
        id: user.id,
        email: user.email,
        name: user.name,
        blog: user.blog,
        bio: user.bio,
        admin: user.admin,
        avatar: avatar!.File.url,
        registerAt: user.registerAt,
        isFriend: user.isFriend,
      };
      const jwt = signJwt(resp);
      setCookie(res, JwtConfig.COOKIE_KEY, jwt);
      res.status(OK.code).json(resp);
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
