import { JwtConfig } from '@/config/jwt';
import * as jwt from 'jsonwebtoken';
import { Unauthorized } from '@/util/error';
import { Simplify } from '@/util/type';
import { User } from '@/dto';
type UserJwtPayload = Simplify<Omit<User.GetResp, 'avatarIds' | 'salt' | 'password'> & { avatar: string }>;

/**
 * Verifies the user's JWT token and returns the payload if
 * it's valid or a response if it's not.
 */
export function verifyAuth(token?: string): Simplify<
  UserJwtPayload & {
    iat: number;
    exp: number;
  }
> {
  if (!token) {
    throw new Unauthorized('Missing user token');
  }

  try {
    const verified = jwt.verify(token, JwtConfig.SECRET);
    return verified as any;
  } catch (err) {
    console.log('jwt auth error', err);
    throw new Unauthorized('Your token has expired.');
  }
}

/**
 * Adds the user token cookie to a response.
 */
export function signJwt(payload: UserJwtPayload) {
  return jwt.sign(payload, JwtConfig.SECRET, {
    expiresIn: '30min',
  });
}
