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
  }
}
