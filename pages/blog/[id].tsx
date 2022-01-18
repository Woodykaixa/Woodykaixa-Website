import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { Blog, Err, OK } from '@/dto';
import { SiteConfig } from '@/config/site';
import { firstValue } from '@/util/api';
import Head from 'next/head';
import { AdminOptions } from '@/config/markdown';
import Markdown from 'markdown-to-jsx';
import { PageHeader, Menu, Dropdown, Button, Tag, Typography, Row } from 'antd';
import { EllipsisOutlined, CommentOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { SEOHeaders } from '@/components/SEOHeaders';
const Blog: NextPage<ServerSideProps> = props => {
  const router = useRouter();
  const back = () => {
    router.push('/blog');
  };
  return (
    <>
      <SEOHeaders.Article title={props.title} description={props.brief} image={props.coverImageUrl} id={props.id} />
      <div className='h-screen w-full bg-white flex flex-col items-center'>
        <PageHeader
          onBack={back}
          className='w-4/5'
          title={<Typography.Title level={1}>{props.title}</Typography.Title>}
          subTitle={moment(props.date).format('yyyy-MM-DD')}
          tags={props.keywords.map(kw => (
            <Tag key={kw} color='blue' className='select-none'>
              {kw}
            </Tag>
          ))}
          extra={[
            <Button key='comment' icon={<CommentOutlined />}>
              评论
            </Button>,
            <Button key='2'>Operation</Button>,
          ]}
        ></PageHeader>
        <div className='w-3/4'>
          <Markdown options={AdminOptions}>{props.content}</Markdown>
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
