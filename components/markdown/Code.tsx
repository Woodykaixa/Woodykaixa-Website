import { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export const Code = (props: { className: string; children: ReactNode }) => {
  if (!props.className) {
    return <code>{props.children}</code>;
  }
  const language = props.className.replace('lang-', '');

  return (
    <div className='relative'>
      <div className='absolute right-0'>
        <Button
          icon={<CopyOutlined />}
          onClick={e => {
            navigator.clipboard.writeText(props.children as string).then(() => {
              message.info('代码已复制');
            });
          }}
        />
      </div>
      <SyntaxHighlighter language={language} style={github}>
        {props.children}
      </SyntaxHighlighter>
    </div>
  );
};
