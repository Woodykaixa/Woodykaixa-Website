import { Simplify } from '@/util/type';
import type { User as UserModel } from '@prisma/client';

export namespace User {
  export type AddDTO = Simplify<Omit<UserModel, 'id' | 'admin' | 'avatarIds'> & { avatar: string; avatarSize: number }>;
  export type AddResp = Simplify<Omit<UserModel, 'password' | 'avatarIds'>>;

  export type GetDTO = { githubId: number };
  export type GetResp = UserModel;

  export type LoginDTO = { email: string; password: string };
  export type LoginResp = Simplify<Omit<UserModel, 'avatarIds' | 'password'> & { avatar: string }>;

  export type AuthDTO = { auth: string };
  export type AuthResp = Simplify<Omit<UserModel, 'avatarIds' | 'password'> & { avatar: string }>;
}
