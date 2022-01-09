import { Simplify } from '@/util/type';
import type { User } from '@prisma/client';
import type { CommonAPIErrorResponse } from './error';

export type CreateUserDTO = Omit<User, 'id' | 'salt' | 'admin' | 'avatarIds'>;

export type CreateUserResp = Omit<User, 'salt' | 'password' | 'avatarIds'> | CommonAPIErrorResponse;

export namespace User {
  export type AddDTO = Simplify<Omit<User, 'id' | 'salt' | 'admin' | 'avatarIds'> & { avatar: string }>;
  export type AddResp = Simplify<Omit<User, 'salt' | 'password' | 'avatarIds'>>;
}
