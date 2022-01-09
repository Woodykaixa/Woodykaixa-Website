import { FileType, File as FileModel } from '@prisma/client';
import { Simplify } from '@/util/type';

export namespace File {
  export type PutFileDTO = { name: string; content: string; auth: string; type: FileType };
  export type PutFileResp = Simplify<FileModel>;

  export const FileTypes: Array<FileType> = ['POST', 'IMAGE', 'AVATAR'];
}
