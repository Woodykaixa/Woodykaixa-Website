import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { notification, Alert } from 'antd';
import { useEffect } from 'react';
import { SiteConfig } from '@/config/site';
import { Err, Oss } from '@/dto';
import Markdown from 'markdown-to-jsx';
import { MarkdownOptions } from '@/config/markdown';
import { CommentList } from '@/components/CommentList';

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
      <Head>
        <meta name='og:title' content={SiteConfig.title} />
        <meta name='og:type' content='website' />
        {process.env.APP_ENV === 'production' && <meta name='og:url' content={process.env.NEXT_PUBLIC_BASE_URL} />}
        <meta name='og:locale' content='zh_CN' />
        <meta property='og:description' content="Woodykaixa's personal website. Blog, personal net dist, etc." />
      </Head>
      <div className='bg-white p-6 flex flex-col items-center mt-8'>
        <Alert
          message='暂时没有时间做多分辨率响应式布局，所以建议在宽度超过1536px的设备上浏览'
          className='2xl:hidden'
          type='warning'
          closable
        />
        <div className='flex flex-col w-3/4 items-center'>
          <Markdown options={MarkdownOptions}>{props.err_or_content}</Markdown>
          <CommentList />
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
  const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/file/get-file?name=README.md');
  const json = await (result.json() as Promise<Oss.GetFileResp>);
  const jErr = json as unknown as Err.CommonResp;
  if (jErr.error) {
    return {
      props: {
        error: true,
        err_or_content: jErr.error,
        desc: jErr.desc,
        mode: process.env.APP_ENV,
      },
    };
  }
  return {
    props: {
      error: false,
      err_or_content: (json as any).content,
      desc: '',
      mode: process.env.APP_ENV,
    },
  };
};

export default Home;
