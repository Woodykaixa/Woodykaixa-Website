import { ReactChildren, ReactNode } from 'react';

export type CommentProps = {
  comment: ReactNode;
  children: ReactNode;
};

export function Comment(props: CommentProps) {
  return (
    <ruby>
      {props.children}
      <rp>(</rp>
      <rt>{props.comment}</rt>
      <rp>)</rp>
    </ruby>
  );
}
