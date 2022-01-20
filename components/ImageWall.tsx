import { Upload, UploadProps, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { Err, Image, OK } from '@/dto';
import { getBase64 } from '@/util/upload';
import { fetcher } from '@/lib/fetcher';

type ImageItem = { uid: string; name: string; url: string };

/**
 * WTF, antd don't export this type?????
 */
type UploadFileStatus = NonNullable<Parameters<NonNullable<UploadProps['onChange']>>[0]['file']['status']>;
export type ImageWallProps = {
  imageList: ImageItem[];
};
export function ImageWall({ imageList }: ImageWallProps) {
  const [images, setImages] = useState<Array<ImageItem & { status: UploadFileStatus }>>([]);

  useEffect(() => {
    setImages(imageList.map(i => ({ ...i, status: 'done' })));
  }, [imageList]);

  const onChange: UploadProps['onChange'] = async ({ file }) => {
    console.log('on change', file);
    if (file.status === 'uploading') {
      const dataUrl = await getBase64(file.originFileObj as File);
      setImages([...images, { uid: file.uid, name: file.name, url: dataUrl, status: 'uploading' }]);
    } else if (file.status === 'done') {
      setImages(
        images.map(i => {
          if (i.name === file.name) {
            return {
              ...i,
              url: (file.response as Image.PutImageResp).File.url,
              status: 'done',
            };
          }
          return i;
        })
      );
    } else if (file.status === 'removed') {
      fetch('/api/image/del', {
        method: 'DELETE',
        body: JSON.stringify({ filename: file.name }),
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
      }).then(res => {
        if (res.status === OK.code) {
          setImages(images.filter(img => img.uid !== file.uid));
        } else {
          message.error('删除文件失败');
        }
      });
    } else if (file.status === 'error') {
      setImages(images.filter(img => img.uid !== file.uid));
    }
  };

  const customRequest: UploadProps['customRequest'] = async options => {
    const b64 = await getBase64(options.file as File);
    fetch('/api/image/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        content: b64,
        filename: (options.file as File).name,
      } as Image.PutImageDTO),
      credentials: 'include',
    })
      .then(async res => {
        const json = await res.json();
        if (res.status === OK.code) {
          return json as Promise<Image.PutImageResp>;
        }
        throw { ...json, status: res.status };
      })
      .then(json => {
        console.log('upload success', options.onSuccess);
        options.onSuccess!(json);
      })
      .catch(err => {
        const resp = err as Err.CommonResp & { status: number };
        const error = new Error(resp.desc);
        error.name = resp.error;
        // @ts-ignore
        error.status = resp.status;
        // @ts-ignore
        error.method = 'POST';

        options.onError!(error);
      });
  };

  return (
    <Upload
      listType='picture-card'
      action='/api/image/add'
      method='POST'
      name='content'
      data={file => ({
        size: file.size,
      })}
      fileList={images}
      customRequest={customRequest}
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
      <div key='upload-button'>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    </Upload>
  );
}
