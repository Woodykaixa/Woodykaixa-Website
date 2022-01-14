import type { GetServerSideProps, NextPage } from 'next';
import { List, Input, Space, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import * as React from 'react';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { Err, OK } from '@/dto';
import { SiteConfig } from '@/config/site';

const { Search } = Input;
type PostType = {
  id: string;
  title: string;
  cover: string;
  description: string;
  content: string;
  createAt: Date;
  keywords: string[];
  comments: number;
};

const Post = ({ title, createAt, keywords, comments, content, id, description, cover }: PostType) => {
  return (
    <List.Item
      key={title}
      actions={[
        <Space key='post-at'>{moment(createAt).format('yyyy-MM-DD')}</Space>,
        <Space key='comments'>
          <MessageOutlined /> {comments}
        </Space>,
        <Space key='post-keywords'>
          {keywords.map(kw => (
            <Tag key={kw}>{kw}</Tag>
          ))}
        </Space>,
      ]}
      extra={<Image width={272} alt='cover' src={cover}></Image>}
    >
      <List.Item.Meta title={<Link href={`/blog/${id}`}>{title}</Link>} description={description} />
      {content}
    </List.Item>
  );
};

const Blog: NextPage<ServerSideProps> = ({ files }) => {
  return (
    <div className='bg-white p-6 flex flex-col items-center mt-8'>
      <div className='flex flex-col w-3/4 items-center'>
        <List
          header={<Search enterButton allowClear></Search>}
          itemLayout='vertical'
          size='large'
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={files}
          footer={
            <div>
              还没仔细研究过，不过本站的所有文章应该会使用 <b>CC-BY-SA-4.0</b> 协议
            </div>
          }
          renderItem={item => <Post {...item} />}
        />
      </div>
    </div>
  );
};

export default Blog;
type ServerSideProps = {
  files: PostType[];
};
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  // 现在没有那么多数据，直接全量获取
  // 我是懒狗
  const postResponse = await fetch(SiteConfig.url + '/api/blog/page?page=0&size=100');
  const posts = await postResponse.json();
  if (postResponse.status === OK.code) {
    return {
      props: {
        files: posts,
        error: null,
      },
    };
  }
  const error = posts as unknown as Err.CommonResp;
  return {
    redirect: {
      destination: `/error?err=${error.error}&desc=${error.desc}&se=true`,
      permanent: false,
    },
  };
};
