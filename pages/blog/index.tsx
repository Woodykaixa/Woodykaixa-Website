import type { GetServerSideProps, NextPage } from 'next';
import { List, Input, Space, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import * as React from 'react';
import moment from 'moment';
import Link from 'next/link';

const { Search } = Input;
type PostType = {
  id: string;
  title: string;
  avatar: string;
  description: string;
  content: string;
  createAt: Date;
  keywords: string[];
  comments: number;
};

const listData = [] as PostType[];
for (let i = 0; i < 23; i++) {
  listData.push({
    id: 'asd',
    title: `ant design part ${i}`,
    createAt: new Date(),
    keywords: ['react', 'typescript', 'next.js'],
    avatar: 'https://joeschmoe.io/api/v1/random',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    comments: 120,
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

const Post = ({ title, createAt, keywords, comments, content, id, description }: PostType) => {
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
      extra={<img width={272} alt='logo' src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' />}
    >
      <List.Item.Meta title={<Link href={`/blog/${id}`}>{title}</Link>} description={description} />
      {content}
    </List.Item>
  );
};

const Blog: NextPage<{
  files: Array<{ path: string; type: string }>;
}> = ({ files }) => {
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
          dataSource={listData}
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  const json = [
    {
      path: 'README.md',
      type: 'markdown',
    },
  ];
  if (Array.isArray(json)) {
    return {
      props: {
        files: json,
      },
    };
  } else {
    console.log(json);
    return {
      props: {
        files: [],
      },
    };
  }
};
