import type { NextApiRequest, NextApiResponse } from 'next';
import { GetFileDTO, GetFileResp } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import { BadRequest, HttpError, NotFound } from '@/util/error';

import ossClient from '@/lib/oss';
import prismaClient from '@/lib/prisma';

export default function handler(req: NextApiRequest, res: NextApiResponse<GetFileResp>) {
  prismaClient
    .$connect()
    .then(() => {
      ensureMethod(req.method, ['GET']);
      return parseParam<GetFileDTO>(req.query, {
        name: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
      });
    })
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
      if (result.res.status !== 200) {
        throw new BadRequest(result.res.status.toString(10));
      }
      res.status(200).json({
        ...file,
        content: result.content.toString(),
      });
    })
    .catch((err: Error) => {
      const code = err instanceof HttpError ? err.code : 400;
      res.status(code).json({
        error: err.name,
        desc: err.message,
      });
    });
}
