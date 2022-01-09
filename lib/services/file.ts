import { Err, File } from '@/dto';
import { BadRequest } from '@/util/error';
import type { PrismaClient } from '@prisma/client';
import { OssService } from '.';

export namespace FileService {
  export async function getFile(prisma: PrismaClient, name: string, type: File.FileType) {
    const file = await prisma.file.findFirst({
      where: {
        filename: `${type}/${name}`,
      },
    });

    if (!file) {
      throw new BadRequest(Err.File.NOT_EXISTS);
    }
    const result = await OssService.getFile(`${type}/${name}`);
    return {
      ...file,
      content: result,
    };
  }

  export async function putFile(prisma: PrismaClient, name: string, content: Buffer, type: File.FileType) {
    const file = await prisma.file.findFirst({
      where: {
        filename: `${type}/${name}`,
      },
    });
    if (file) {
      throw new BadRequest(Err.File.EXISTS);
    }

    const result = await OssService.putFile(`${type}/${name}`, content);
    return await prisma.file.create({
      data: {
        ...result,
        type,
      },
    });
  }
}
