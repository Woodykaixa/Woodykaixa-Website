import type { NextApiRequest, NextApiResponse } from 'next';
import { Oss, File, Err, OK } from '@/dto';
import { ensureMethod, parseParam, firstValue, isType } from '@/util/api';
import { BadRequest, errorHandler, HttpError } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { FileService } from '@/lib/services';
/**
 * POST /api/file/put-file
 *
 * param [File.PutFileDTO]
 *
 * response [File.PutFileResp]
 *
 * @description Upload a file. Firstly, check if the filename exists in db. If does, throw a error. Otherwise
 * invoke /api/oss/put-file, upload file to OSS, and create a File document in db.
 */

export default function handler(req: NextApiRequest, res: NextApiResponse<File.PutFileResp | Err.CommonResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<File.PutFileDTO>(req.body, {
        name: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        content: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        auth: param => ({
          valid: isType(param, 'string') && param === process.env.OSS_PUT_AUTH,
          parsed: param!,
        }),
        type: param => ({
          valid: !!param && File.FileTypes.includes(param),
          parsed: param!,
        }),
      })
    )
    .then(async param => {
      console.log(param.auth);
      const bufferEncoding = param.type === 'POST' ? 'utf8' : 'base64';
      return FileService.putFile(prismaClient, param.name, Buffer.from(param.content, bufferEncoding), param.type);
    })
    .then(file => {
      res.status(OK.code).json(file);
    })
    .catch(errorHandler(res));
}
