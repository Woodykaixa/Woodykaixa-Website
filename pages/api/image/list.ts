import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, OK, Image } from '@/dto';
import { ensureMethod, isType, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';
import prismaClient from '@/lib/prisma';

export default function handler(req: NextApiRequest, res: NextApiResponse<Image.ListImageResp | Err.CommonResp>) {
  ensureMethod(req.method, ['GET'])
    .then(() =>
      parseParam<Image.ListImageDTO>(req.query, {
        size: param => {
          if (!isType(param, 'string')) {
            return {
              valid: false,
              parsed: 0,
            };
          }
          const parsed = parseInt(param as string, 10);
          return {
            valid: parsed > 0,
            parsed,
          };
        },
        page: param => {
          if (!isType(param, 'string')) {
            return {
              valid: false,
              parsed: 0,
            };
          }
          const parsed = parseInt(param as string, 10);
          return {
            valid: parsed >= 0,
            parsed,
          };
        },
      })
    )
    .then(async ({ page, size }) => {
      return await prismaClient.imageFile.findMany({
        skip: page * size,
        take: size,
        include: {
          File: true,
        },
      });
    })
    .then(file => {
      res.status(OK.code).json(file);
    })
    .catch(errorHandler(res));
}
