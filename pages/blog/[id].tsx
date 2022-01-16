import type { GetServerSideProps, NextPage } from 'next';
import { List, Input, Space, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import * as React from 'react';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { Err, OK } from '@/dto';
import { SiteConfig } from '@/config/site';
import { firstValue } from '@/util/api';

const Blog: NextPage<ServerSideProps> = ({ id }) => {
  return <div className='h-screen w-full bg-white'>you are reading blog with post id: {id}</div>;
};

export default Blog;
type ServerSideProps = {
  id: string;
};
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  // 现在没有那么多数据，直接全量获取
  // 我是懒狗
  console.log(ctx.query);
  return {
    props: {
      id: firstValue(ctx.query.id)!,
    },
  };
};
