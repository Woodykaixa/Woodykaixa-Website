import { Upload as AntdUpload, message, UploadProps, Modal, Slider } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import { User } from '@/dto';
import styled from 'styled-components';
import AvatarEditor from 'react-avatar-editor';

const Upload = styled(AntdUpload)`
  display: flex;
  justify-content: center;

  & .ant-upload-select-picture-card {
    width: auto;
    height: auto;
  }
`;

function getBase64(img: Blob) {
  return new Promise<string>(res => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      res(reader.result as string);
    });
    reader.readAsDataURL(img);
  });
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('Image must smaller than 1MB!');
  }
  return isJpgOrPng && isLt1M;
};

function useModal() {
  const [showModal, setShowModal] = useState(false);
  return {
    showModal,
    closeModal: () => setShowModal(false),
    openModal: () => setShowModal(true),
  };
}

export function AvatarUploader(props: { avatarSize: number; form: FormInstance<User.AddDTO>; loading: boolean }) {
  const { showModal, closeModal, openModal } = useModal();
  const [scale, setScale] = useState(1);
  const [imageUrl, _setImageUrl] = useState<string | null>(null);
  const [originImageUrl, setOriginImageUrl] = useState('');
  const ref = useRef<AvatarEditor | null>(null);

  const setImageData = (url: string, size: number) => {
    _setImageUrl(url);
    props.form.setFieldsValue({
      avatar: url,
      avatarSize: size,
    });
  };

  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj!).then(res => {
        setOriginImageUrl(res);
        openModal();
        setScale(1);
      });
    }
  };

  return (
    <>
      <Modal
        visible={showModal}
        closable={false}
        onOk={() => {
          const canvas = ref.current!.getImage();
          setImageData(canvas.toDataURL(), canvas.height);
          closeModal();
        }}
        onCancel={() => {
          closeModal();
        }}
        className='flex flex-col items-center'
      >
        <AvatarEditor
          ref={ref}
          image={originImageUrl}
          width={props.avatarSize * 2}
          height={props.avatarSize * 2}
          border={0}
          borderRadius={props.avatarSize}
          color={[0, 0, 0, 0.6]} // RGBA
          scale={scale}
        />
        <Slider step={0.1} value={scale} max={5} min={1} onChange={setScale} className='w-full' />
      </Modal>
      <Upload
        name='avatar'
        listType='picture-card'
        className='avatar-uploader'
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt='avatar'
            className='rounded-full'
            height={props.avatarSize}
            width={props.avatarSize}
            draggable={false}
          />
        ) : (
          <div
            style={{ width: props.avatarSize, height: props.avatarSize }}
            className='flex justify-center items-center'
          >
            <div>
              {props.loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </div>
        )}
      </Upload>
    </>
  );
}
