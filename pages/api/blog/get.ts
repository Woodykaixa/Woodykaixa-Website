import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Blog, Err, OK } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import { FileService } from '@/lib/services';

export default function handler(req: NextApiRequest, res: NextApiResponse<Blog.GetResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['GET']))
    .then(() =>
      parseParam<Blog.GetDTO>(req.query, {
        id: parseParam.parser.strLengthGt(0),
      })
    )
    .then(async ({ id }) => {
      const post = await prismaClient.postFile.findFirst({
        where: {
          id,
        },

        include: {
          Comments: true,
        },
      });
      if (!post) {
        throw new BadRequest(Err.Blog.NOT_EXISTS);
      }
      return Promise.all([post, FileService.getFile(prismaClient, post.title, 'POST')]);
    })
    .then(([post, file]) => {
      res.status(OK.code).json({
        Comments: post.Comments,
        content: file.content,
        date: post.date,
        id: post.id,
        keywords: post.keywords,
        hasCover: post.hasCover,
        title: post.title,
      });
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
