import type { NextApiRequest, NextApiResponse } from 'next';
import { File, Err, OK } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { FileService, OssService } from '@/lib/services';

const { parser } = parseParam;

export default function handler(req: NextApiRequest, res: NextApiResponse<File.PutFileResp | Err.CommonResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<File.PutFileDTO>(req.body, {
        name: parser.string,
        content: parser.string,
        auth: parser.secondaryCheck<string>(parser.string, value => value === process.env.OSS_PUT_AUTH),
        type: parser.secondaryCheck(parser.string as any, value => File.FileTypes.includes(value as any)),
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
