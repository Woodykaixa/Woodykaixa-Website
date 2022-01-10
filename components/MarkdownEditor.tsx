import { MarkdownOptions } from '@/config/markdown';
import { Input, Menu } from 'antd';
import Markdown from 'markdown-to-jsx';
import { useState } from 'react';
import { useThrottledInput } from '@/util/hooks';

export type MarkdownEditorProps = {
  editable?: boolean;
  editorRows?: number;
  className?: string;
  editorClassName?: string;
};
type TabType = 'text' | 'preview';
export function MarkdownEditor({ editable = true, editorRows = 10, className, editorClassName }: MarkdownEditorProps) {
  const [tab, setTab] = useState<TabType>('text');
  const [content, setContent] = useThrottledInput('', 500);
  return (
    <div className={className}>
      <Menu
        mode='horizontal'
        selectedKeys={[tab]}
        onClick={e => {
          setTab(e.key as TabType);
        }}
      >
        <Menu.Item key='text'>编辑</Menu.Item>
        <Menu.Item key='preview'>预览</Menu.Item>
      </Menu>
      {tab === 'text' && (
        <Input.TextArea
          rows={editorRows}
          disabled={!editable}
          autoSize={{ maxRows: 20 }}
          className={`resize-none min-h-40 ${editorClassName ?? ''}`}
          value={content}
          onChange={e => {
            setContent(e.target.value);
          }}
        />
      )}
      {tab === 'preview' && (
        <div className='bg-white px-4 min-h-40'>
          <Markdown options={MarkdownOptions}>{content}</Markdown>
        </div>
      )}
    </div>
  );
}