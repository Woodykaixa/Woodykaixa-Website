// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextMiddleware } from 'next/server';
import { signJwt, verifyAuth } from '@/lib/jwt';
import { JwtConfig } from '@/config/jwt';
import { HttpError, Unauthorized } from '@/util/error';

export const middleware: NextMiddleware = async (req, event) => {
  // Add the user token to the response
  const token = req.cookies[JwtConfig.COOKIE_KEY];
  console.log(req);
  console.log(req.headers);
  try {
    const payload = verifyAuth(token);
    if (!payload.admin) {
      throw new Unauthorized(`${payload.name} is not admin`);
    }
    console.log(payload);
    return NextResponse.next();
  } catch (err) {
    if (err instanceof HttpError) {
      return new Response(
        JSON.stringify({
          error: err.name,
          desc: err.message,
        }),
        {
          status: err.code,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }
  }
};
