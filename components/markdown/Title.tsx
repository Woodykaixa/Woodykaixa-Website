import { Typography } from 'antd';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
const { Title: AntdTitle } = Typography;

export function Title(props: { children: [string] | [ReactNode]; level: 1 | 2 | 3 | 4 | 5 }) {
  const router = useRouter();
  return (
    <AntdTitle level={props.level} className='ref-title'>
      {props.level < 2 ? (
        <Link href={router.pathname + '#' + props.children[0]}>
          {/* assume children is string */}
          {props.children[0]}
        </Link>
      ) : (
        props.children[0]
      )}
    </AntdTitle>
  );
}
