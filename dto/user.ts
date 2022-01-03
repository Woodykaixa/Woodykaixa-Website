import { User } from 'prisma/prisma-client';
export type CreateUserDTO = Omit<User, 'id' | 'salt' | 'admin'>;

export type CreateUserResp = User | { err: string; desc: string };
