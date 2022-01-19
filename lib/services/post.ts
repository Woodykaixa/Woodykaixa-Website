import { FileService } from '.';

import type { PrismaClient } from '@prisma/client';

export namespace PostService {
  export async function getPostById(prisma: PrismaClient, id: string) {
    return prisma.postFile.findFirst({
      where: {
        id,
      },
    });
  }

  export async function getPostByTitle(prisma: PrismaClient, title: string) {
    return prisma.postFile.findFirst({
      where: {
        title,
      },
    });
  }

  export async function getPostsByKeywords(prisma: PrismaClient, keywords: string[]) {
    return prisma.postFile.findMany({
      where: {
        keywords: {
          hasEvery: keywords,
        },
      },
    });
  }

  export async function putPost(
    prisma: PrismaClient,
    title: string,
    content: Buffer,
    keywords: string[],
    date: Date,
    coverImageId: string | null
  ) {
    const brief = content.slice(0, 200).toString('utf-8').slice(0, 100).split('\n')[0];

    const putFileResult = await FileService.putFile(prisma, title, content, 'POST');
    return await prisma.postFile.create({
      data: {
        title,
        brief,
        coverImageId,
        keywords,
        date,
        fileId: putFileResult.id,
        comments: [],
      },
    });
  }
}
