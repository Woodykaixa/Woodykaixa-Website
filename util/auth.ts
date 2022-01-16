import { verifyAuth } from '@/lib/jwt';
import { Unauthorized } from './error';

export const requireAdmin = (token: string | null) => {
  const payload = userInfo(token);
  if (!payload || !payload.admin) {
    throw new Unauthorized(`you are not admin`);
  }
  return payload;
};

export const userInfo = (jwt: string | null) => {
  if (!jwt) {
    return null;
  }
  return verifyAuth(jwt);
};
