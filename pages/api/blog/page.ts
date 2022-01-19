import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Blog, Err, OK } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';
import { omit } from 'lodash';

export default function handler(req: NextApiRequest, res: NextApiResponse<Blog.ListResp | Err.CommonResp>) {
  const query = req.query as unknown as Blog.ListDTO;
  if (query.page) {
    query.page = Number(query.page);
  }

  if (query.size) {
    query.size = Number(query.size);
  }
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['GET']))
    .then(() =>
      parseParam<Blog.ListDTO>(query, {
        page: parseParam.parser.intGe(0),
        size: parseParam.parser.intGt(0),
      })
    )
    .then(async ({ size, page }) => {
      return prismaClient.postFile.findMany({
        take: size,
        skip: size * page,
        include: {
          cover: {
            select: {
              File: true,
            },
          },
        },
      });
    })
    .then(posts => {
      const result = posts.map(post => ({
        ...omit(post, ['fileId', 'coverImageId']),
        comments: post.comments.length,
        coverImageUrl: post.cover?.File.url ?? null,
      })) as Blog.ListResp;
      res.status(OK.code).json(result);
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
