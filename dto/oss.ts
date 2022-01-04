import type { CommonAPIErrorResponse } from './error';
export type ListFilesDTO =
  | Array<{
      path: string;
      type: string;
    }>
  | CommonAPIErrorResponse;
