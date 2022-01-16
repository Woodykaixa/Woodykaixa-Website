import { MarkdownOptions } from '@/config/markdown';
import { Input, Menu, Button, Modal, Upload, UploadProps } from 'antd';
import Markdown from 'markdown-to-jsx';
import { useState } from 'react';
import { FileImageOutlined, PlusOutlined, CopyOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getBase64 } from '@/util/upload';
import Image from 'next/image';

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
  value: string;
  updateValue: (value: string) => void;
};

type TabType = 'text' | 'preview';

export function MarkdownEditor({
  editable = true,
  editorRows = 10,
  className,
  editorClassName,
  value,
  updateValue,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<TabType>('text');
  const [images, setImages] = useState<{ uid: string; name: string; url: string }[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const onChange: UploadProps['onChange'] = info => {
    console.log(info);
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj!).then(dataUrl => {
        setImages([
          ...images,
          {
            uid: info.file.uid,
            name: info.file.name,
            url: dataUrl,
          },
        ]);
      });
    } else if (info.file.status === 'removed') {
      console.log(images);
      console.log(info.file);
      console.log(
        'removed',
        images.filter(img => img.uid !== info.file.uid)
      );
      setImages([...images.filter(img => img.uid !== info.file.uid)]);
    }
  };
  return (
    <>
      <Modal closable onCancel={() => setShowUploadModal(false)} footer={null} visible={showUploadModal}>
        <Upload
          listType='picture-card'
          onChange={onChange}
          showUploadList={{
            showDownloadIcon: true,
            downloadIcon: <CopyOutlined className='text-white opacity-80 hover:opacity-100' />,
          }}
          // 这里把下载按钮给换成了复制按钮，用来自动复制一个 ![name](url) 格式的 markdown
          onDownload={e => {
            console.log(e);
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
            <div className='flex w-full bg-white'>
              <Button icon={<FileImageOutlined />} onClick={() => setShowUploadModal(true)} />
            </div>

            <Input.TextArea
              rows={editorRows}
              disabled={!editable}
              autoSize={{ maxRows: 20 }}
              value={value}
              className='resize-none min-h-40'
              onChange={e => {
                updateValue(e.target.value);
              }}
            />
          </div>
        )}
        {tab === 'preview' && (
          <div className='bg-white px-4 min-h-40'>
            <Markdown options={MarkdownOptions}>{value}</Markdown>
          </div>
        )}
      </div>
    </>
  );
}
