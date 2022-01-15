export * from './avatar';
export * from './error';
export * from './file';
export * from './oss';
export * from './user';
export * from './blog';

export namespace OK {
  export const code = 200 as const;
  export const text = 'ok' as const;
}
