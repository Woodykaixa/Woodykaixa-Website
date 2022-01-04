import type { User } from '@prisma/client';
import type { CommonAPIErrorResponse } from './error';

export type CreateUserDTO = Omit<User, 'id' | 'salt' | 'admin'>;

export type CreateUserResp = Omit<User, 'salt' | 'password'> | CommonAPIErrorResponse;
