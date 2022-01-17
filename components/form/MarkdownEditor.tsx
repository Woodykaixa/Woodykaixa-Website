import { AdminOptions, MarkdownOptions } from '@/config/markdown';
import { Input, Menu, Button, Modal, Upload, UploadProps, message } from 'antd';
import Markdown from 'markdown-to-jsx';
import { useState, useMemo } from 'react';
import { FileImageOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { Image } from '@/dto';
import { useUserInfo } from '@/util/context/useUserContext';
import { AntdControlledProps } from '.';

const UploadButton = () => (
  <div key='upload-button'>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export type MarkdownEditorProps = {
  editable?: boolean;
  editorRows?: number;
  className?: string;
  editorClassName?: string;
} & AntdControlledProps<string>;

type TabType = 'text' | 'preview';

export function MarkdownEditor({
  editable = true,
  editorRows = 10,
  className,
  editorClassName,
  value = '',
  onChange: antdOnChange,
}: MarkdownEditorProps) {
  const updateValue = useMemo(() => antdOnChange!, []);
  const [user] = useUserInfo();
  const [tab, setTab] = useState<TabType>('text');
  const [images, setImages] = useState<{ uid: string; name: string; url: string }[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const onChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'done') {
      setImages([
        ...images,
        {
          uid: info.file.uid,
          name: info.file.name,
          url: (info.file.response as Image.PutImageResp).File.url,
        },
      ]);
    } else if (info.file.status === 'removed') {
      setImages([...images.filter(img => img.uid !== info.file.uid)]);
    }
  };
  return (
    <>
      <Modal closable onCancel={() => setShowUploadModal(false)} footer={null} visible={showUploadModal}>
        <Upload
          listType='picture-card'
          action='/api/image/add'
          method='POST'
          name='content'
          data={file => ({
            size: file.size,
          })}
          onChange={onChange}
          showUploadList={{
            showDownloadIcon: true,
            downloadIcon: <CopyOutlined className='text-white opacity-80 hover:opacity-100' />,
          }}
          // 这里把下载按钮给换成了复制按钮，用来自动复制一个 ![name](url) 格式的 markdown
          onDownload={file => {
            navigator.clipboard.writeText(`![${file.name}](@${file.name})`).then(() => {
              message.info('链接已复制');
            });
          }}
        >
          <UploadButton />
        </Upload>
      </Modal>
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
          <div>
            {user?.admin && (
              <div className='flex w-full bg-white'>
                <Button icon={<FileImageOutlined />} onClick={() => setShowUploadModal(true)} />
              </div>
            )}

            <Input.TextArea
              rows={editorRows}
              disabled={!editable}
              autoSize={{ maxRows: 20 }}
              value={value}
              className={(editorClassName ?? '') + ' resize-none min-h-40'}
              onChange={e => {
                updateValue(e.target.value);
              }}
            />
          </div>
        )}
        {tab === 'preview' && (
          <div className='bg-white px-4 min-h-40'>
            <Markdown options={user?.admin ? AdminOptions : MarkdownOptions}>{value}</Markdown>
          </div>
        )}
      </div>
    </>
  );
}
