import { ReactChildren, ReactNode } from 'react';

export type CommentProps = {
  comment: ReactNode;
  children: ReactNode;
};

export function Comment(props: CommentProps) {
  console.log(props.comment);
  console.log(props);
  return (
    <ruby>
      {props.children}
      <rp>(</rp>
      <rt>{props.comment}</rt>
      <rp>)</rp>
    </ruby>
  );
}
