import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, OK, Oss } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';

import prismaClient from '@/lib/prisma';
import { FileService } from '@/lib/services';

export default function handler(req: NextApiRequest, res: NextApiResponse<Oss.GetFileResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['GET']))
    .then(() =>
      parseParam<Oss.GetFileDTO>(req.query, {
        name: parseParam.parser.string,
      })
    )
    .then(param => FileService.getFile(prismaClient, param.name, 'POST'))
    .then(file => {
      res.status(OK.code).json(file);
    })
    .catch(errorHandler(res));
}
