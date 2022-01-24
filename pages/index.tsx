import type { NextPage, GetServerSideProps } from 'next';
import { notification, Alert } from 'antd';
import { useEffect } from 'react';
import { Err, OK } from '@/dto';
import { MinimalOptions } from '@/config/markdown';
import { SEOHeaders } from '@/components/SEOHeaders';
import { MarkdownViewer } from '@/components/MarkdownViewer';
const Home: NextPage<ServerSideProps> = props => {
  useEffect(() => {
    console.log('APP_ENV:', props.mode);
  }, []);

  useEffect(() => {
    if (props.error) {
      notification.error({
        message: '获取主页信息失败',
        description: props.desc,
      });
    }
  }, []);

  return (
    <>
      <SEOHeaders.Index description="Woodykaixa's personal website. Profile, blog, personal net dist, etc." />
      <div className='bg-white p-6 flex flex-col items-center mt-8'>
        <Alert
          message='暂时没有时间做多分辨率响应式布局，所以建议在宽度超过1536px的设备上浏览'
          className='2xl:hidden'
          type='warning'
          closable
        />
        <div className='flex flex-col w-3/4 items-center'>
          <MarkdownViewer components={MinimalOptions}>{props.err_or_content}</MarkdownViewer>
        </div>
      </div>
    </>
  );
};

type ServerSideProps = {
  error: boolean;
  err_or_content: string;
  desc: string;
  mode: string;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/index-article');
  const content = await result.text();
  if (result.status === OK.code) {
    return {
      props: {
        error: false,
        err_or_content: content,
        desc: '',
        mode: process.env.APP_ENV,
      },
    };
  }
  const jErr = JSON.parse(content) as Err.CommonResp;
  return {
    props: {
      error: true,
      err_or_content: jErr.error,
      desc: jErr.desc,
      mode: process.env.APP_ENV,
    },
  };
};

export default Home;
