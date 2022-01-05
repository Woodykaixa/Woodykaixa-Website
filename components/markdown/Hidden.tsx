import React, { ReactChildren } from 'react';

export function Hidden(props: { children: ReactChildren }) {
  return (
    <span className='bg-black text-black hover:text-white ease-linear duration-200 transition'>{props.children}</span>
  );
}
