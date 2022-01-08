import type { PrismaClient } from '@prisma/client';

declare global {
  // PrismaClient is attached to the `global` object in development to prevent
  // exhausting your database connection limit.
  //
  // Learn more:
  // https://pris.ly/d/help/next-js-best-practices
  // So we only use this global var in development mode
  var prisma: PrismaClient;

  declare namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: 'development' | 'production' | 'staging';
      PORT?: string;
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      OSS_BUCKET: string;
      OSS_REGION: string;
      ACCESS_KEY_ID: string;
      ACCESS_KEY_SECRET: string;
      DATABASE_URL: string;
    }
  }
}

export {};
