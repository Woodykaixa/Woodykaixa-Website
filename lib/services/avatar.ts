import prismaClient from '@/lib/prisma';
import { FileService } from '.';

import type { PrismaClient } from '@prisma/client';

export namespace AvatarService {
  export async function putAvatar(
    prisma: PrismaClient,
    filename: string,
    content: Buffer,
    width: number,
    height: number,
    userId: string
  ) {
    const putFileResult = await FileService.putFile(prisma, filename, content, 'AVATAR');
    return await prismaClient.avatarFile.create({
      data: {
        filename,
        height,
        width,
        userId,
        fileId: putFileResult.id,
      },
    });
  }
}
