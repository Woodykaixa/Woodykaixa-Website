import { Simplify } from '@/util/type';
import type { PostFile, Comment } from '@prisma/client';

export namespace Blog {
  export type AddDTO = Simplify<Omit<PostFile, 'id' | 'fileId' | 'date' | 'comments' | 'brief'> & { content: string }>;
  export type AddResp = Simplify<PostFile>;

  export type GetDTO = { id: string };
  export type GetResp = Simplify<
    Omit<PostFile, 'comments' | 'fileId' | 'brief' | 'coverImageId'> & {
      content: string;
      Comments: Comment[];
      coverImageUrl: string | null;
    }
  >;

  export type ListDTO = {
    page: number;
    size: number;
  };
  export type ListResp = Array<Simplify<Omit<PostFile, 'fileId' | 'comments'> & { comments: number }>>;
}
