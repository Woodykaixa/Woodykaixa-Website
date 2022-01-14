import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Err, OK, User } from '@/dto';
import { ensureMethod, parseParam, isType } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import { UserService } from '@/lib/services';

export default function handler(req: NextApiRequest, res: NextApiResponse<User.GetResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['GET']))
    .then(() =>
      parseParam<User.GetDTO>(req.query, {
        githubId: param => ({
          valid: isType(param, 'string'),
          parsed: parseInt((param as any) ?? '0', 10),
        }),
      })
    )
    .then(async dto => {
      const user = await UserService.findByGitHubId(prismaClient, dto.githubId);

      if (!user) {
        throw new BadRequest(Err.User.NOT_EXISTS);
      }
      return user;
    })
    .then(user => {
      res.status(OK.code).json(user);
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
