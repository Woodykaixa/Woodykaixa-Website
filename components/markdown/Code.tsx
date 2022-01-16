import { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export const Code = (props: { className: string; children: ReactNode }) => {
  console.log(props);
  const language = props.className.replace('lang-', '');
  return (
    <div className='flex flex-col'>
      <div>
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
