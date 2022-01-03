import type { User } from '@prisma/client';
export type CreateUserDTO = Omit<User, 'id' | 'salt' | 'admin'>;

export type CreateUserResp = Omit<User, 'salt' | 'password'> | { err: string; desc: string };
