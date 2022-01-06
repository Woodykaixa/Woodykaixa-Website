import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO, CreateUserResp } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import bcrypt from 'bcrypt';

const client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
export default function handler(req: NextApiRequest, res: NextApiResponse<CreateUserResp>) {
  console.log(req.query, req.body);
  console.log(process.env.DATABASE_URL);
  client
    .$connect()
    .then(() => {
      ensureMethod(req.method, ['POST']);
      return parseParam<CreateUserDTO>(req.body, {
        blog: param => ({
          valid: true,
          parsed: param ? firstValue(param) : null,
        }),
        email: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        github_id: param => ({
          valid: !!param,
          parsed: parseInt(firstValue(param!), 10),
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
      });
    })
    .then(dto => {
      return client.user
        .findFirst({
          where: {
            github_id: dto.github_id,
          },
        })
        .then(user => {
          if (!user) {
            console.log('dto:', dto);
            const salt = bcrypt.genSaltSync();
            const password = bcrypt.hashSync(dto.password, salt);
            return client.user.create({
              data: {
                ...dto,
                admin: false,
                password,
                salt,
              },
            });
          } else {
            return user;
          }
        });
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
      return client.$disconnect();
    });
}
