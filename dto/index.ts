export * from './avatar';
export * from './blog';
export * from './error';
export * from './file';
export * from './image';
export * from './oss';
export * from './user';

export namespace OK {
  export const code = 200 as const;
  export const text = 'ok' as const;
}
