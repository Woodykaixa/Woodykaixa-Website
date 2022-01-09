import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Avatar, Err, OK, User } from '@/dto';
import { ensureMethod, parseParam, firstValue, isType } from '@/util/api';
import bcrypt from 'bcrypt';
import { BadRequest, HttpError, errorHandler } from '@/util/error';
import { SiteConfig } from '@/config/site';

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
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['POST']))
    .then(() =>
      parseParam<User.AddDTO>(req.body, {
        blog: param => ({
          valid: true,
          parsed: param ? firstValue(param) : null,
        }),
        email: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        github_id: param => ({
          valid: !!param && typeof param === 'number',
          parsed: param!,
        }),
        name: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        password: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        bio: param => ({
          valid: true,
          parsed: param ? firstValue(param) : null,
        }),
        avatar: param => ({
          valid: isType(param, 'string') && param!.startsWith('data:image'),
          parsed: param!,
        }),
      })
    )
    .then(async dto => {
      const user = await prismaClient.user.findFirst({
        where: {
          github_id: dto.github_id,
        },
      });
      if (user) {
        throw new BadRequest(Err.User.EXISTS);
      }

      const salt = bcrypt.genSaltSync();
      const password = bcrypt.hashSync(dto.password, salt);
      const newUser = await prismaClient.user.create({
        data: {
          github_id: dto.github_id,
          email: dto.email,
          name: dto.name,
          blog: dto.blog,
          bio: dto.bio,
          admin: false,
          password,
          salt,
          avatarIds: [],
        },
      });

      const avatarPutResp = await fetch(SiteConfig.Url + '/api/avatar/put', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          auth: process.env.OSS_PUT_AUTH,
          content: dto.avatar.split(',')[1],
          filename: dto.name + '-avatar-01',
          height: SiteConfig.avatarSize,
          width: SiteConfig.avatarSize,
          userId: newUser.id,
        } as Avatar.PutDTO),
      });
      const avatarPutResult = (await avatarPutResp.json()) as Avatar.PutResp;
      if (avatarPutResp.status !== OK.code) {
        const jErr = avatarPutResult as unknown as Err.CommonResp;
        const err = new HttpError(jErr.desc, avatarPutResp.status);
        err.name = jErr.error;
        throw err;
      }

      return prismaClient.user.update({
        where: {
          id: newUser.id,
        },
        data: {
          avatarIds: [avatarPutResult.id],
        },
      });
    })
    .then(user => {
      console.log('created a user:', user);
      res.status(OK.code).json({
        admin: user.admin,
        bio: user.bio,
        blog: user.blog,
        github_id: user.github_id,
        name: user.name,
        email: user.email,
        id: user.id,
      });
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
