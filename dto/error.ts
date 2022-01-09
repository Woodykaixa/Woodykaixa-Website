export namespace Err {
  export type CommonResp = {
    error: string;
    desc: string;
  };

  export const User = {
    EXISTS: 'User exists',
  } as const;

  export type UserErrorType = typeof User[keyof typeof User];

  export const File = {
    EXISTS: 'File exists',
    NOT_EXISTS: 'File not exists',
  } as const;

  export type FileErrorType = typeof File[keyof typeof File];

  export type ErrorType = UserErrorType | FileErrorType;
}
