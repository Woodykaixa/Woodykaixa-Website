import { Simplify } from '@/util/type';
import type { File } from '@prisma/client';

export namespace Oss {
  export const OssFileEncodings = ['utf8', 'base64'] as const;
  export type OssFileEncodingType = typeof OssFileEncodings[number];

  export type PutFileDTO = { name: string; content: string; auth: string; encoding: OssFileEncodingType };
  export type PutFileResp = Simplify<Omit<File, 'id' | 'type'>>;

  export type GetFileResp = Simplify<
    File & {
      content: string;
    }
  >;
  export type GetFileDTO = { name: string };
}
