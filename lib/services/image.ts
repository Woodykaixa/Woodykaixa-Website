import type { PrismaClient } from '@prisma/client';
import { FileService } from '.';

export namespace ImageService {
  export async function getImageById(prisma: PrismaClient, id: string) {
    return prisma.imageFile.findFirst({
      where: { id },
      include: {
        File: true,
      },
    });
  }

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

  export async function deleteImageById(prisma: PrismaClient, id: string) {
    const image = await prisma.imageFile.findFirst({
      where: { id },
    });
    if (image) {
      await FileService.deleteFile(prisma, image.fileId);
      await prisma.imageFile.delete({ where: { id } });
    }
  }
}
