export * from './KeywordEditor';
export * from './MarkdownEditor';

export type AntdControlledProps<T> = {
  value?: T;
  onChange?: (value: T) => void; // this is not undefined, just avoid compiler error
};
