export const JwtConfig = {
  SECRET: process.env.JWT_SECRET,
  COOKIE_KEY: 'user-auth',
} as const;
