import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, OK, Image } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { ImageService } from '@/lib/services';
import imageSize from 'image-size';
import busboy from 'busboy';

export default function handler(req: NextApiRequest, res: NextApiResponse<Image.PutImageResp | Err.CommonResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<Image.PutImageDTO>(req.body, {
        filename: parseParam.parser.strLengthGt(0),
        content: parseParam.parser.secondaryCheck(parseParam.parser.string, value => value.startsWith('data:image')),
      })
    )
    .then(async param => {
      const contentBuffer = Buffer.from(param.content.split(',')[1], 'base64');
      const size = imageSize(contentBuffer);
      console.log('image size', size.width, size.height);
      console.log('buffer size', contentBuffer.length);
      return ImageService.putImage(prismaClient, param.filename, contentBuffer, size.width ?? 0, size.height ?? 0);
    })
    .then(file => {
      res.status(OK.code).json(file);
    })
    .catch(errorHandler(res));
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
