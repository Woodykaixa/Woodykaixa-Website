export type ListFilesDTO =
  | Array<{
      path: string;
      type: string;
    }>
  | { err: string; desc: string };
