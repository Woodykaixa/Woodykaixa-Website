import { CommonAPIErrorResponse } from '.';
import { FileType, File as FileModel } from '@prisma/client';

export namespace File {
  export type PutFileDTO = { name: string; content: string; auth: string; type: FileType };
  export type PutFileResp = FileModel | CommonAPIErrorResponse;

  export const FileTypes: Array<FileType> = ['POST', 'IMAGE', 'AVATAR'];
}
