import { FileType as FileModelType, File as FileModel } from '@prisma/client';
import { Simplify } from '@/util/type';

export namespace File {
  export type GetFileDTO = { name: string; type: FileType };
  export type GetFileResp = Simplify<FileModel>;

  export type PutFileDTO = { name: string; content: string; auth: string; type: FileType };
  export type PutFileResp = Simplify<FileModel>;

  export const FileTypes: Array<FileType> = ['POST', 'IMAGE', 'AVATAR'];
  export type FileType = FileModelType;
}
