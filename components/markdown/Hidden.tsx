import React, { ReactChildren } from 'react';

export function Hidden(props: { children: ReactChildren }) {
  return (
    <span className='hidden-wrapper bg-black text-black dark:text-black hover:text-white ease-linear duration-200 transition'>
      {props.children}
    </span>
  );
}
