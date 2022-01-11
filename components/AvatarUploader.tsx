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
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

function useModal() {
  const [showModal, setShowModal] = useState(false);
  return {
    showModal,
    closeModal: () => setShowModal(false),
    openModal: () => setShowModal(true),
  };
}

export function AvatarUploader(props: { img: string; width: number; height: number; form: FormInstance<User.AddDTO> }) {
  const { showModal, closeModal, openModal } = useModal();
  const [scale, setScale] = useState(1);
  let imgUrl = props.img;
  const [imageUrl, _setImageUrl] = useState(props.img);
  const [originImageUrl, setOriginImageUrl] = useState(props.img);
  const ref = useRef<AvatarEditor | null>(null);

  const setImageUrl = (url: string) => {
    console.log(url);
    _setImageUrl(url);
    props.form.setFieldsValue({
      avatar: url,
    });
  };
  useEffect(() => {
    if (!imgUrl.startsWith('http')) {
      return;
    }
    fetch(imgUrl)
      .then(res => {
        return res.blob();
      })
      .then(getBase64)
      .then(url => {
        setImageUrl(url);
        console.log(url);
      });
  }, [imgUrl]);

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
          const canvas = ref.current!.getImage().toDataURL();
          setImageUrl(canvas);
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
          width={props.width}
          height={props.height}
          border={0}
          borderRadius={props.width / 2}
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
        <Image
          src={imageUrl}
          alt='avatar'
          className='rounded-full'
          height={props.height}
          width={props.width}
          draggable={false}
        />
      </Upload>
    </>
  );
}
