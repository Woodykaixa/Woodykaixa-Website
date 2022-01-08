import type { CommonAPIErrorResponse } from './error';
import type { File, FileType } from '@prisma/client';
export type ListFilesResp =
  | Array<{
      path: string;
      type: string;
    }>
  | CommonAPIErrorResponse;

export type GetFileDTO = { name: string };
export type GetFileResp =
  | (File & {
      content: string;
    })
  | CommonAPIErrorResponse;
export type PutFileDTO = { name: string; content: string; auth: string };
export type PutFileResp = Omit<File, 'id' | 'type'> | CommonAPIErrorResponse;

export namespace Oss {
  export type PutFileDTO = { name: string; content: string; auth: string };
  export type PutFileResp = Omit<File, 'id' | 'type'>;
}
