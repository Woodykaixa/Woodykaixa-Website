import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { CreateUserDTO, CreateUserResp } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import bcrypt from 'bcrypt';

export default function handler(req: NextApiRequest, res: NextApiResponse<CreateUserResp>) {
  console.log(req.query, req.body);
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['POST']))
    .then(() =>
      parseParam<CreateUserDTO>(req.body, {
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
      })
    )
    .then(async dto => {
      const user = await prismaClient.user.findFirst({
        where: {
          github_id: dto.github_id,
        },
      });
      if (!user) {
        console.log('dto:', dto);
        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(dto.password, salt);
        return prismaClient.user.create({
          data: {
            ...dto,
            admin: false,
            password,
            salt,
            avatarIds: [],
          },
        });
      } else {
        return user;
      }
    })
    .then(user => {
      console.log('created a user:', user);
      res.status(200).json({
        admin: user.admin,
        bio: user.bio,
        blog: user.blog,
        github_id: user.github_id,
        name: user.name,
        email: user.email,
        id: user.id,
      });
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(400).json({ error: err.name, desc: err.message });
    })
    .finally(() => {
      console.log('client disconnected');
      return prismaClient.$disconnect();
    });
}
