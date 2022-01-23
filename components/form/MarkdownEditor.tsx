import { AdminOptions, MinimalOptions } from '@/config/markdown';
import { Input, Menu, Button, Modal, Upload, UploadProps, message } from 'antd';
import { useState, useMemo, useEffect, useRef, Ref, MutableRefObject } from 'react';
import { FileImageOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { Err, Image, OK } from '@/dto';
import { useUserInfo } from '@/util/context/useUserContext';
import { AntdControlledProps } from '.';
import { getBase64 } from '@/util/upload';
import { MarkdownViewer } from '../MarkdownViewer';
import { OmniImage } from '../markdown/OmniImage';
import { ImageWall } from '../ImageWall';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export type MarkdownEditorProps = {
  editable?: boolean;
  editorRows?: number;
  className?: string;
  editorClassName?: string;
  tab: EditorTabType;
  setTab: (tab: EditorTabType) => void;
  context?: ImageReferenceContext;
} & AntdControlledProps<string>;

export type EditorTabType = 'text' | 'preview';
export type ImageReferenceContext = {
  siteImages: string[];
};
function useImageList() {
  const { data, error } = useSWR<Image.ListImageResp, Err.CommonResp>('/api/image/list?page=0&size=100', fetcher);

  return {
    images: data?.map(img => ({ uid: img.id, name: img.filename, url: img.File.url })) ?? [],
    error,
  };
}

export function MarkdownEditor({
  editable = true,
  editorRows = 10,
  className,
  editorClassName,
  value = '',
  onChange: antdOnChange,
  tab,
  setTab,
  context,
}: MarkdownEditorProps) {
  const updateValue = useMemo(() => antdOnChange!, []);
  const [user] = useUserInfo();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { images, error } = useImageList();
  if (error) {
    message.error(error.desc, 1);
  }
  return (
    <>
      <Modal closable onCancel={() => setShowUploadModal(false)} footer={null} visible={showUploadModal}>
        <ImageWall imageList={images} />
      </Modal>
      <div className={className}>
        <Menu
          mode='horizontal'
          selectedKeys={[tab]}
          onClick={e => {
            setTab(e.key as EditorTabType);
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
            <MarkdownViewer
              components={
                user?.admin
                  ? context
                    ? {
                        ...AdminOptions,
                        img({ className, alt, src }) {
                          return <CountRefImage context={context} alt={alt} src={src}></CountRefImage>;
                        },
                      }
                    : AdminOptions
                  : MinimalOptions
              }
            >
              {value}
            </MarkdownViewer>
          </div>
        )}
      </div>
    </>
  );
}

function CountRefImage({
  src = '',
  alt,
  context,
  className,
}: {
  src?: string;
  alt?: string;
  context: ImageReferenceContext;
  className?: string;
}) {
  useEffect(() => {
    context.siteImages.push(src);
    return () => {
      context.siteImages = context.siteImages.filter(i => i !== src);
    };
  }, [src, context]);
  return <OmniImage src={src} alt={alt} className={className}></OmniImage>;
}
