import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, OK, Oss } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import { BadRequest, NotFound, errorHandler } from '@/util/error';

import ossClient from '@/lib/oss';
import prismaClient from '@/lib/prisma';

export default function handler(req: NextApiRequest, res: NextApiResponse<Oss.GetFileResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['GET']))
    .then(() =>
      parseParam<Oss.GetFileDTO>(req.query, {
        name: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
      })
    )
    .then(param => {
      return prismaClient.file.findFirst({
        where: {
          filename: param.name,
        },
      });
    })
    .then(file => {
      if (!file) {
        throw new NotFound('File not found');
      }
      return Promise.all([Promise.resolve(file), ossClient.get(file.filename)]);
    })
    .then(([file, result]) => {
      if (result.res.status !== OK.code) {
        throw new BadRequest(result.res.status.toString(10));
      }
      res.status(OK.code).json({
        ...file,
        content: result.content.toString(),
      });
    })
    .catch(errorHandler(res));
}
