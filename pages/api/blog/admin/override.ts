import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Blog, Err, OK, Oss } from '@/dto';
import { ensureMethod, isType, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';
import { PostService } from '@/lib/services/post';
import { ImageService, OssService } from '@/lib/services';
import { BadRequest } from '@/util/error';
import { without } from 'lodash';
import { createBriefFromContent } from '@/util/blog';

const mapImageNameToId = (images: string[]): Promise<string[]> => {
  return images
    .map(i => i.replace('@', ''))
    .reduce(async (idArray, image) => {
      const imageModel = await ImageService.getImageByName(prismaClient, image);
      if (imageModel) {
        return [...(await idArray), imageModel.id];
      }
      return idArray;
    }, Promise.resolve([] as string[]));
};

type OverridePost = (params: Blog.OverrideDTO) => Promise<void>;

const overridePost: OverridePost = async param => {
  const content = Buffer.from(param.content, 'utf-8');
  const imageIds = await mapImageNameToId(param.referencedImages);
  const post = await prismaClient.postFile.findFirst({
    where: {
      title: param.title,
    },
    include: {
      referencedImages: true,
    },
  });
  if (!post) {
    throw new BadRequest(Err.Blog.NOT_EXISTS);
  }
  const oldImageIds = post.referencedImageIds;
  const removeRef = without(oldImageIds, ...imageIds);
  const addRef = without(imageIds, ...oldImageIds);
  console.log('old', oldImageIds);
  console.log('new', imageIds);
  console.log('remove', removeRef);
  console.log('add', addRef);
  for (const id of removeRef) {
    await prismaClient.imageFile.update({
      where: { id },
      data: {
        referencedBy: {
          disconnect: {
            id: post.id,
          },
        },
      },
    });
  }
  await prismaClient.imageFile.updateMany({
    where: {
      id: {
        in: addRef,
      },
    },
    data: {
      referencedPostIds: {
        push: post.id,
      },
    },
  });
  await prismaClient.postFile.update({
    where: {
      title: param.title,
    },
    data: {
      keywords: param.keywords,
      hasCover: param.hasCover,
      referencedImageIds: {
        set: imageIds,
      },
      brief: createBriefFromContent(param.content),
    },
  });
  await OssService.putFile('POST/' + param.title, content);
};

const overrideSpecial: OverridePost = async param => {
  const content = Buffer.from(param.content, 'utf-8');

  await OssService.putFile(param.title, content);
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Blog.OverrideResp | Err.CommonResp>) {
  prismaClient
    .$connect()
    .then(() => ensureMethod(req.method, ['POST']))
    .then(() =>
      parseParam<Blog.OverrideDTO>(req.body, {
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
      const capture = /(POST|SPECIAL)\/(.+)/.exec(dto.title);
      if (!capture) {
        throw new BadRequest('title format: (IMAGE|POST)/.+');
      }
      const [, type, titleNoType] = capture;
      const override = type === 'SPECIAL' ? overrideSpecial : overridePost;
      await override({ ...dto, title: titleNoType });
    })
    .then(post => {
      res.status(OK.code).json({ status: 'ok' });
    })
    .catch(errorHandler(res))
    .finally(() => {
      return prismaClient.$disconnect();
    });
}
