import { File as FileModel, ImageFile } from '@prisma/client';
import { Simplify } from '@/util/type';
import { File } from './file';

export namespace Image {
  export type PutImageDTO = { filename: string; content: string };
  export type PutImageResp = Simplify<ImageFile & { File: FileModel }>;

  export type DelImageDTO = { filename: string };
  export type DelImageResp = { status: 'ok' };

  export type ListImageDTO = { page: number; size: number };
  export type ListImageResp = Simplify<ImageFile & { File: FileModel }>[];
}
