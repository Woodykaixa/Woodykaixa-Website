export namespace Err {
  export type CommonResp = {
    error: string;
    desc: string;
  };

  export const User = {
    EXISTS: 'User exists',
    NOT_EXISTS: 'User not exists',
    WRONG_PASSWORD: 'Wrong password',
  } as const;

  export type UserErrorType = typeof User[keyof typeof User];

  export const Email = {
    EXISTS: 'Email exists',
    NOT_EXISTS: 'Email not exists',
  } as const;

  export type EmailErrorType = typeof Email[keyof typeof Email];

  export const File = {
    EXISTS: 'File exists',
    NOT_EXISTS: 'File not exists',
  } as const;

  export type FileErrorType = typeof File[keyof typeof File];

  export const Blog = {
    EXISTS: 'Post exists',
    NOT_EXISTS: 'Post not exists',
  } as const;

  export type BlogErrorType = typeof File[keyof typeof File];

  export type ErrorType = UserErrorType | FileErrorType | BlogErrorType;
}
