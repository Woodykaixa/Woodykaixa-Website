import type { NextApiRequest, NextApiResponse } from 'next';
import { File, Err, OK, Image } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { ImageService } from '@/lib/services';

const { parser } = parseParam;

export default function handler(req: NextApiRequest, res: NextApiResponse<Image.PutImageResp | Err.CommonResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<Image.PutImageDTO>(req.body, {
        filename: parser.string,
        content: parser.string,
        width: parser.intGt(0),
        height: parser.intGt(0),
      })
    )
    .then(async param => {
      if (param.filename.length <= 0) {
        throw new BadRequest('filename length <= 0');
      }
      const contentBuffer = Buffer.from(param.content, 'base64');
      return ImageService.putImage(prismaClient, param.filename, contentBuffer, param.width, param.height);
    })
    .then(file => {
      res.status(OK.code).json(file);
    })
    .catch(errorHandler(res));
}
