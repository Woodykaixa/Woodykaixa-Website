import { Upload as AntdUpload, message, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import { User } from '@/dto';
import styled from 'styled-components';

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

export function AvatarUploader(props: { img: string; width: number; height: number; form: FormInstance<User.AddDTO> }) {
  const [loading, setLoading] = useState(false);
  let imgUrl = props.img;
  const [imageUrl, _setImageUrl] = useState(props.img);
  const setImageUrl = (url: string) => {
    _setImageUrl(url);
    props.form.setFieldsValue({
      avatar: url,
    });
  };
  useEffect(() => {
    setLoading(true);
    if (!imgUrl.startsWith('http')) {
      setLoading(false);
    }
    fetch(imgUrl)
      .then(res => {
        return res.blob();
      })
      .then(getBase64)
      .then(url => {
        setLoading(false);
        setImageUrl(url);
        console.log(url);
      });
  }, [imgUrl]);

  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj!).then(res => {
        setLoading(false);
        setImageUrl(res);
      });
    }
  };

  return (
    <Upload
      name='avatar'
      listType='picture-card'
      className='avatar-uploader'
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt='avatar' className='rounded-full' height={props.height} width={props.width}></Image>
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
}
