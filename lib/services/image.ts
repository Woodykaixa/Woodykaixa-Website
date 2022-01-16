import type { PrismaClient } from '@prisma/client';
import { FileService } from '.';

export namespace ImageService {
  export async function putImage(prisma: PrismaClient, name: string, content: Buffer, width: number, height: number) {
    const file = await FileService.putFile(prisma, name, content, 'IMAGE');

    return prisma.imageFile.create({
      data: {
        filename: name,
        fileId: file.id,
        width,
        height,
      },
      include: {
        File: true,
      },
    });
  }
}
