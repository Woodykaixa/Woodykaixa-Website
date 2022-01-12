import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Err, OK, User } from '@/dto';
import { ensureMethod, parseParam, isType } from '@/util/api';
import { BadRequest, errorHandler, Unauthorized } from '@/util/error';
import { UserService, AvatarService } from '@/lib/services';
import { signJwt, verifyAuth } from '@/lib/jwt';
import { JwtConfig } from '@/config/jwt';
import { setCookie } from '@/util/cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse<User.LoginResp | Err.CommonResp>) {
  Promise.all([
    parseParam<User.LoginDTO>(req.query, {
      githubId: param => ({
        valid: isType(param, 'string'),
        parsed: parseInt((param as any) ?? '0', 10),
      }),
    }),
    prismaClient.$connect(),
    ensureMethod(req.method, ['GET']),
  ] as const)
    .then(async ([dto]) => {
      const user = await UserService.findByGitHubId(prismaClient, dto.githubId);
      if (!user) {
        throw new BadRequest(Err.User.NOT_EXISTS);
      }
      return user;
    })
    .then(async user => {
      const avatar = await AvatarService.getAvatarById(prismaClient, user.avatarIds[0]);
      const jwt = signJwt({
        id: user.id,
        github_id: user.github_id,
        email: user.email,
        name: user.name,
        blog: user.blog,
        bio: user.bio,
        admin: user.admin,
        avatar: avatar!.File.url,
      });
      res.status(OK.code).json({ jwt });
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
