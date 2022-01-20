import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, OK, Image } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { ImageService } from '@/lib/services';
import imageSize from 'image-size';
import busboy from 'busboy';

export default function handler(req: NextApiRequest, res: NextApiResponse<Image.DelImageResp | Err.CommonResp>) {
  ensureMethod(req.method, ['DELETE'])
    .then(() =>
      parseParam<Image.DelImageDTO>(req.body, {
        filename: parseParam.parser.strLengthGt(0),
      })
    )
    .then(async param => {
      const image = await prismaClient.imageFile.findFirst({
        where: {
          filename: param.filename,
        },
      });
      if (image) {
        await ImageService.deleteImageById(prismaClient, image.id);
      }
    })
    .then(s => {
      res.status(OK.code).json({ status: 'ok' });
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
