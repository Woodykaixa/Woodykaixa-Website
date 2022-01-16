import { File as FileModel, ImageFile } from '@prisma/client';
import { Simplify } from '@/util/type';
import { File } from './file';

export namespace Image {
  export type PutImageDTO = Simplify<Omit<ImageFile, 'id' | 'fileId'> & Pick<File.PutFileDTO, 'content'>>;
  export type PutImageResp = Simplify<ImageFile & { File: FileModel }>;
}
