import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import moment from 'moment';
import { Blog, Err, OK } from '@/dto';
import { SiteConfig } from '@/config/site';
import { AdminOptions } from '@/config/markdown';
import Markdown from 'markdown-to-jsx';
import { PageHeader, Button, Tag, Typography, message } from 'antd';
import { CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { SEOHeaders } from '@/components/SEOHeaders';
const Blog: NextPage<ServerSideProps> = props => {
  return (
    <>
      <SEOHeaders.Article title={props.title} description={props.brief} image={props.coverImageUrl} id={props.id} />
      <div className='h-screen w-full bg-white flex flex-col items-center'>
        <div className='w-3/4'>
          <PageHeader
            className='px-0 mt-4'
            title={<Typography.Title level={1}>{props.title}</Typography.Title>}
            // subTitle={moment(props.date).format('yyyy-MM-DD')}
            tags={props.keywords.map(kw => (
              <Tag key={kw} color='blue' className='select-none'>
                {kw}
              </Tag>
            ))}
            extra={[
              <Button
                key='comment'
                icon={<CommentOutlined />}
                onClick={() => {
                  message.info('在做了在做了');
                }}
              >
                评论
              </Button>,
              <Button
                key='share'
                icon={<ShareAltOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(location.href).then(() => {
                    message.info('链接已复制');
                  });
                }}
              >
                分享
              </Button>,
            ]}
          ></PageHeader>

          <Markdown options={AdminOptions}>
            {`发布于 ${moment(props.date).format('yyyy-MM-DD')}\n\n` + props.content}
          </Markdown>
        </div>
      </div>
    </>
  );
};

export default Blog;
type ServerSideProps = Blog.GetResp & { brief: string };

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  const postResponse = await fetch(SiteConfig.url + '/api/blog/get?id=' + ctx.query.id);
  const postData = (await postResponse.json()) as Blog.GetResp;
  if (postResponse.status !== OK.code) {
    const err = postData as unknown as Err.CommonResp;
    return {
      redirect: {
        permanent: false,
        destination: `/error?err=${err.error}&desc=${encodeURIComponent(err.desc)}`,
      },
    };
  }
  return {
    props: { ...postData, brief: postData.content.slice(0, 100) },
  };
};
