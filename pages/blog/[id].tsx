import type { GetServerSideProps, NextPage } from 'next';
import { List, Input, Space, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
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

const Blog: NextPage<ServerSideProps> = props => {
  return (
    <div className='h-screen w-full bg-white'>
      <Markdown options={AdminOptions}>{props.content}</Markdown>
    </div>
  );
};

export default Blog;
type ServerSideProps = Blog.GetResp;

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
    props: postData,
  };
};
