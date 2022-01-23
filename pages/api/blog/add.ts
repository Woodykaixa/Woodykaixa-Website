import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Blog, Err, OK } from '@/dto';
import { ensureMethod, isType, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';
import { PostService } from '@/lib/services/post';
import { ImageService } from '@/lib/services';

export default function handler(req: NextApiRequest, res: NextApiResponse<Blog.AddResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['POST']))
    .then(() =>
      parseParam<Blog.AddDTO>(req.body, {
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
        referencedImages: parseParam.parser.secondaryCheck<string[]>(parseParam.parser.array, param => {
          param.forEach(p => {
            if (!isType(p, 'string')) {
              return false;
            }
          });
          return true;
        }),
        hasCover: parseParam.parser.boolean,
      })
    )
    .then(async dto => {
      const content = Buffer.from(dto.content, 'utf-8');
      const imageIds = await dto.referencedImages
        .map(i => i.replace('@', ''))
        .reduce(async (idArray, image) => {
          const imageModel = await ImageService.getImageByName(prismaClient, image);
          if (imageModel) {
            return [...(await idArray), imageModel.id];
          }
          return idArray;
        }, Promise.resolve([] as string[]));
      console.log('image ids', imageIds);
      const post = await PostService.putPost(
        prismaClient,
        dto.title,
        content,
        dto.keywords,
        new Date(),
        imageIds,
        dto.hasCover
      );
      await prismaClient.imageFile.updateMany({
        where: {
          id: {
            in: imageIds,
          },
        },
        data: {
          referencedPostIds: {
            push: post.id,
          },
        },
      });
      return post;
    })
    .then(post => {
      res.status(OK.code).json(post);
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
