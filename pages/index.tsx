import type { NextPage, GetStaticProps, GetServerSideProps } from 'next';
import { Typography, notification } from 'antd';
import { useEffect } from 'react';
import { SiteConfig } from '@/config/site';
import { CommonAPIErrorResponse, GetFileResp } from '@/dto';
import Markdown from 'markdown-to-jsx';
const { Text, Title, Paragraph, Link } = Typography;
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
    <div className='bg-white p-6 flex flex-col items-center mt-8'>
      <Markdown
        options={{
          wrapper: Typography,
          overrides: {
            h1: {
              component: Title,
              props: {
                level: 1,
              },
            },
            h2: {
              component: Title,
              props: {
                level: 2,
              },
            },
            h3: {
              component: Title,
              props: {
                level: 3,
              },
            },
            h4: {
              component: Title,
              props: {
                level: 4,
              },
            },
            h5: {
              component: Title,
              props: {
                level: 5,
              },
            },
            link: {
              component: Link,
              props: {
                target: '_blank',
              },
            },
            del: {
              component: Text,
              props: {
                delete: true,
              },
            },
            p: {
              component: Paragraph,
            },
            br: {
              component: Paragraph,
            },
          },
        }}
      >
        {props.err_or_content}
      </Markdown>
    </div>
  );
};

type ServerSideProps = {
  error: boolean;
  err_or_content: string;
  desc: string;
  mode: string;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/oss/get?name=README.md');
  const json = await (result.json() as Promise<GetFileResp>);
  const jErr = json as CommonAPIErrorResponse;
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
