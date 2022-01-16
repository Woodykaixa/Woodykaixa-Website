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
    .then(
      () =>
        new Promise<Image.PutImageDTO>((res, rej) => {
          const bb = busboy({ headers: req.headers, defCharset: '7bit' });
          const param = {} as Image.PutImageDTO;
          let size = 0;
          let content = '';
          bb.on('file', (name, file, info) => {
            if (name !== 'content') {
              return;
            }
            const { filename, encoding, mimeType } = info;
            param.filename = filename;
            console.log(`File [${name}]: filename: %j, encoding: %j, mimeType: %j`, filename, encoding, mimeType);
            file
              .on('data', data => {
                content += data.toString('base64');
              })
              .on('close', () => {});
          });
          bb.on('field', (name, val, info) => {
            if (name === 'size') {
              size = parseInt(val, 10);
            }
          });
          bb.on('close', () => {
            const size = imageSize(Buffer.from(content, 'base64'));
            param.width = size.width!;
            param.height = size.height!;
            param.content = content;
            res(param);
          });
          req.pipe(bb);
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

export const config = {
  api: {
    bodyParser: false,
  },
};
