import { Simplify } from '@/util/type';
import type { PostFile, Comment } from '@prisma/client';

export namespace Blog {
  export type AddDTO = Simplify<
    Omit<PostFile, 'id' | 'fileId' | 'date' | 'comments' | 'brief' | 'referencedImageIds'> & {
      content: string;
      referencedImages: string[];
    }
  >;
  export type AddResp = Simplify<Omit<PostFile, 'referencedImageIds'>>;

  export type GetDTO = { id: string };
  export type GetResp = Simplify<
    Omit<PostFile, 'comments' | 'fileId' | 'brief' | 'referencedImageIds' | 'hasCover'> & {
      content: string;
      Comments: Comment[];
      coverImageUrl: string | null;
    }
  >;

  export type GetByTitleDTO = { title: string };
  export type GetByTitleResp = Simplify<
    Omit<PostFile, 'comments' | 'fileId' | 'brief' | 'referencedImageIds' | 'date'> & {
      content: string;
    }
  >;

  export type OverrideDTO = Simplify<
    Omit<PostFile, 'id' | 'fileId' | 'date' | 'comments' | 'brief' | 'referencedImageIds'> & {
      content: string;
      referencedImages: string[];
    }
  >;
  export type OverrideResp = { status: 'ok' };

  export type ListDTO = {
    page: number;
    size: number;
  };
  export type ListResp = Array<
    Simplify<
      Omit<PostFile, 'fileId' | 'comments' | 'referencedImageIds'> & { comments: number; coverImageUrl: string | null }
    >
  >;
}
