import { Simplify } from '@/util/type';
import type { User as UserModel } from '@prisma/client';

export namespace User {
  export type AddDTO = Simplify<Omit<UserModel, 'id' | 'salt' | 'admin' | 'avatarIds'> & { avatar: string }>;
  export type AddResp = Simplify<Omit<UserModel, 'salt' | 'password' | 'avatarIds'>>;

  export type GetDTO = { githubId: number };
  export type GetResp = UserModel;

  export type LoginDTO = { githubId: number };
  export type LoginResp = {};

  export type AuthDTO = { auth: string };
  export type AuthResp = Simplify<Omit<UserModel, 'avatarIds' | 'salt' | 'password'> & { avatar: string }>;
}
