import type { NextApiRequest, NextApiResponse } from 'next';
import { File, Err, OK } from '@/dto';
import { ensureMethod, parseParam, firstValue, isType } from '@/util/api';
import { errorHandler, HttpError } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { FileService, OssService } from '@/lib/services';

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
      const content = Buffer.from(param.content, bufferEncoding);
      const file = await prismaClient.file.findFirst({
        where: {
          filename: `${param.type}/${param.name}`,
        },
      });
      if (!file) {
        return FileService.putFile(prismaClient, param.name, content, param.type);
      } else {
        await OssService.putFile(`${param.type}/${param.name}`, content);
      }
      return file;
    })
    .then(file => {
      res.status(OK.code).json(file);
    })
    .catch(errorHandler(res));
}
