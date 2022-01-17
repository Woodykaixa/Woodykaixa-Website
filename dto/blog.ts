import { Simplify } from '@/util/type';
import type { PostFile } from '@prisma/client';

export namespace Blog {
  export type ListDTO = {
    page: number;
    size: number;
  };

  export type ListResp = Array<Simplify<Omit<PostFile, 'fileId' | 'comments'> & { comments: number }>>;

  export type AddDTO = Simplify<Omit<PostFile, 'id' | 'fileId' | 'date' | 'comments' | 'brief'> & { content: string }>;
  export type AddResp = Simplify<PostFile>;
}
