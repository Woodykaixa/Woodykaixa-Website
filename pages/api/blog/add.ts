import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Blog, Err, OK } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';
import { PostService } from '@/lib/services/post';

export default function handler(req: NextApiRequest, res: NextApiResponse<Blog.AddResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['POST']))
    .then(() =>
      parseParam<Blog.AddDTO>(
        req.body,
        {
          title: parseParam.parser.strLengthGt(0),
          content: parseParam.parser.string,
          keywords: parseParam.parser.secondaryCheck<string[]>(parseParam.parser.array, arr => {
            for (const item of arr) {
              if (typeof item !== 'string') {
                return false;
              }
            }
            return true;
          }),
          coverImageId: parseParam.parser.string,
        },
        ['coverImageId']
      )
    )
    .then(async dto => {
      const content = Buffer.from(dto.content, 'utf-8');
      return PostService.putPost(prismaClient, dto.title, content, dto.keywords, new Date(), dto.coverImageId ?? null);
    })
    .then(post => {
      res.status(OK.code).json(post);
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
