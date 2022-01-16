import { Result, Button, Typography } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { ReactNode } from 'react';

const { Paragraph } = Typography;
const SPECIAL_ERROR_SETTING: Record<
  string,
  {
    img: string;
    contact: boolean;
    title?: string;
    desc?: ReactNode;
  }
> = {
  access_denied: {
    img: 'error-deny.png',
    contact: false,
    title: '授权被拒绝',
    desc: (
      <div className='desc'>
        <Paragraph>为什么要跑嘛。</Paragraph>
        <Paragraph>人家只是想和你一起玩而已呀。</Paragraph>
        <Paragraph>点个同意授权一下好不好嘛！</Paragraph>
      </div>
    ),
  },
  default: {
    img: 'error-img.png',
    contact: true,
  },
};

export type ErrorPageProps = {
  reason: string;
  title: string;
  serverError: boolean;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ reason, title, serverError }) => {
  const setting = SPECIAL_ERROR_SETTING[title] ?? {
    ...SPECIAL_ERROR_SETTING.default,
    title: title,
    desc: (
      <div className='desc'>
        <Paragraph>报错信息: {reason}</Paragraph>
        {serverError ? (
          <>
            <Paragraph>你遇到了服务器内部错误，可能是由于服务器访问 GitHub 失败。</Paragraph>
            <Paragraph>站长也在找原因呢.jpg</Paragraph>
          </>
        ) : (
          <>
            <Paragraph>看起来是因为站长的 GitHub App 设置有问题，才导致了登录失败。</Paragraph>
            <Paragraph>你可以考虑联系站长</Paragraph>
          </>
        )}
      </div>
    ),
  };
  return (
    <div className='m-16 flex justify-center'>
      <Result
        icon={
          <Image src={`/images/${setting.img}`} alt='error' width={150} height={150} className='rounded-full'></Image>
        }
        status='error'
        title={setting.title}
        className='p-24 bg-white py-44 w-full max-w-7xl'
        extra={
          setting.contact && [
            <Button type='primary' key='contact' href='mailto:690750353@qq.com'>
              联系站长
            </Button>,
          ]
        }
      >
        {setting.desc}
      </Result>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { query } = ctx;
  return {
    props: {
      serverError: query.se === 'true',
      title: query.err,
      reason: query.desc,
    },
  };
};

export default ErrorPage;
