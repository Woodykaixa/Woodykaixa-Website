import type { CommonAPIErrorResponse } from './error';
export type ListFilesDTO =
  | Array<{
      path: string;
      type: string;
    }>
  | CommonAPIErrorResponse;

export type GetFileDTO = { name: string };
export type GetFileResp = { content: string } | CommonAPIErrorResponse;
export type PutFileDTO = { name: string; content: string; auth: string };
export type PutFileResp = {} | CommonAPIErrorResponse;
