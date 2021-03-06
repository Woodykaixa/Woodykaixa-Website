import type { NextApiRequest, NextApiResponse, NextConfig } from 'next';
import prismaClient from '@/lib/prisma';
import { Err, OK, User } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import { SiteConfig } from '@/config/site';
import { UserService, AvatarService } from '@/lib/services';

/**
 * POST /api/user/add
 *
 * param [User.AddDTO]
 *
 * response [User.AddResp]
 *
 * @description Create a user in db. First, we check if this user is already existed by checking his github_id, if
 * exists, returns 400. Secondly, we create a User model and an Avatar model in db. Then we add the Avatar's id in
 * User's `avatarIds` field
 */

export default function handler(req: NextApiRequest, res: NextApiResponse<User.AddResp | Err.CommonResp>) {
  console.log(req);
  console.log(req.headers);
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['POST']))
    .then(() =>
      parseParam<User.AddDTO>(
        req.body,
        {
          blog: param => ({
            valid: true,
            parsed: (param as string) ?? null,
          }),
          email: parseParam.parser.string,
          name: parseParam.parser.string,
          password: parseParam.parser.string,
          bio: parseParam.parser.string,
          avatar: parseParam.parser.secondaryCheck<string>(parseParam.parser.string, value =>
            value.startsWith('data:image')
          ),
          avatarSize: parseParam.parser.int,
          isFriend: parseParam.parser.boolean,
        },
        ['bio', 'blog']
      )
    )
    .then(async dto => {
      {
        const user = await UserService.findByEmail(prismaClient, dto.email);

        if (user) {
          throw new BadRequest(Err.Email.EXISTS);
        }
      }

      const user = await UserService.createUser(
        prismaClient,
        dto.email,
        dto.name,
        dto.password,
        [],
        dto.isFriend,
        dto.blog,
        dto.bio
      );
      const avatarBuffer = Buffer.from(dto.avatar.split(',')[1], 'base64');
      const avatar = await AvatarService.putAvatar(
        prismaClient,
        `${user.name}-avatar-${user.avatarIds.length}`,
        avatarBuffer,
        dto.avatarSize,
        dto.avatarSize,
        user.id
      );

      return UserService.setUserAvatar(prismaClient, user.id, avatar.id);
    })
    .then(user => {
      console.log('created a user:', user);
      res.status(OK.code).json({
        admin: user.admin,
        bio: user.bio,
        blog: user.blog,
        name: user.name,
        email: user.email,
        id: user.id,
        registerAt: user.registerAt,
        isFriend: user.isFriend,
      });
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
