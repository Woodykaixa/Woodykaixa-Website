import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Blog, Err, OK } from '@/dto';
import { ensureMethod, parseParam } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
import { FileService, OssService } from '@/lib/services';

type FetchContent = (title: string) => Promise<Blog.GetByTitleResp>;

const fetchSpecial: FetchContent = async title => {
  const file = await OssService.getFile(title);

  return {
    content: file,
    // Just fake properties
    id: '',
    keywords: [],
    hasCover: false,
    title,
  };
};

const fetchPost: FetchContent = async title => {
  const post = await prismaClient.postFile.findFirst({
    where: {
      title,
    },
  });
  if (!post) {
    throw new BadRequest(Err.Blog.NOT_EXISTS);
  }
  const file = await FileService.getFile(prismaClient, post.title, 'POST');
  return {
    content: file.content,
    id: post.id,
    keywords: post.keywords,
    hasCover: post.hasCover,
    title: post.title,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Blog.GetByTitleResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['GET']))
    .then(() =>
      parseParam<Blog.GetByTitleDTO>(req.query, {
        title: parseParam.parser.strLengthGt(0),
      })
    )
    .then(async ({ title }) => {
      const capture = /(POST|SPECIAL)\/(.+)/.exec(title);
      if (!capture) {
        throw new BadRequest('title format: (IMAGE|POST)/.+');
      }
      const [, type, titleNoType] = capture;
      const fetcher = type === 'SPECIAL' ? fetchSpecial : fetchPost;
      return fetcher(titleNoType);
    })
    .then(post => {
      res.status(OK.code).json(post);
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
