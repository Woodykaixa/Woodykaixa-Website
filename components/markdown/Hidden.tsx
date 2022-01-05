import React, { ReactChildren } from 'react';

export function Hidden(props: { children: ReactChildren }) {
  return <span className='bg-black text-black hover:text-white'>{props.children}</span>;
}
