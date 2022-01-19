import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, User } from '@/dto';
import { ensureMethod } from '@/util/api';
import { errorHandler } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { omit } from 'lodash';

export default async function handler(req: NextApiRequest, res: NextApiResponse<User.FriendListResp | Err.CommonResp>) {
  ensureMethod(req.method, ['GET'])
    .then(() => prismaClient.$connect())
    .then(async () => {
      const friends = await prismaClient.user.findMany({
        where: {
          admin: false,
          isFriend: true,
        },
        include: {
          avatars: {
            select: {
              File: true,
            },
          },
        },
      });
      const responseList: User.FriendListResp = friends.map(f => ({
        ...omit(f, ['avatarIds', 'password', 'admin', 'blog']),
        blog: f.blog!,
        avatar: f.avatars[0].File.url,
      }));
      res.status(200).json(responseList);
    })
    .catch(errorHandler(res))
    .finally(() => prismaClient.$disconnect());
}
