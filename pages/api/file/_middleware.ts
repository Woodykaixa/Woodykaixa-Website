// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextMiddleware, NextRequest } from 'next/server';
import { JwtConfig } from '@/config/jwt';
import { HttpError } from '@/util/error';
import { requireAdmin } from '@/util/auth';

export const middleware: NextMiddleware = async (req, event) => {
  if (req.url.includes('get-file')) {
    return NextResponse.next();
  }
  try {
    requireAdmin(req.cookies[JwtConfig.COOKIE_KEY]);
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
