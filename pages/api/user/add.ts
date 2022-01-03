import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO, CreateUserResp } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import bcrypt from 'bcrypt';

const client = new PrismaClient();
export default function handler(req: NextApiRequest, res: NextApiResponse<CreateUserResp>) {
  console.log(req.query, req.body);
  client
    .$connect()
    .then(() => {
      ensureMethod(req.method, ['POST']);
      return parseParam<CreateUserDTO>(JSON.parse(req.body), {
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
    })
    .then(user => {
      console.log('created a user:', user);
      res.status(200).json(user);
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(400).json({ err: err.name, desc: err.message });
    })
    .finally(() => {
      console.log('client disconnected');
      return client.$disconnect();
    });
}
