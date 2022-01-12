export * from './avatar';
export * from './error';
export * from './file';
export * from './github';
export * from './oss';
export * from './user';

export namespace OK {
  export const code = 200 as const;
  export const text = 'ok' as const;
}
