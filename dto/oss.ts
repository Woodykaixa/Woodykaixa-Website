import type { File } from '@prisma/client';
import { Err } from '.';
export type ListFilesResp =
  | Array<{
      path: string;
      type: string;
    }>
  | Err.CommonResp;

export type GetFileDTO = { name: string };
export type GetFileResp =
  | (File & {
      content: string;
    })
  | Err.CommonResp;
export type PutFileDTO = { name: string; content: string; auth: string };
export type PutFileResp = Omit<File, 'id' | 'type'> | Err.CommonResp;

export namespace Oss {
  export const OssFileEncodings = ['utf8', 'base64'] as const;
  export type OssFileEncodingType = typeof OssFileEncodings[number];
  export type PutFileDTO = { name: string; content: string; auth: string; encoding: OssFileEncodingType };
  export type PutFileResp = Omit<File, 'id' | 'type'>;
}
