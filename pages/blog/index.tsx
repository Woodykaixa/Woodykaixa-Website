import type { GetServerSideProps, NextPage } from 'next';
import { List, Input, Space, Tag, Form, Mentions, Button } from 'antd';
import { MessageOutlined, SearchOutlined } from '@ant-design/icons';
import * as React from 'react';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { Blog, Err, OK } from '@/dto';
import { SiteConfig } from '@/config/site';
import Head from 'next/head';
import { SearchTags } from '@/util/search';

const { Search } = Input;
type PostType = Blog.ListResp[number];

const Post = ({ title, date, keywords, comments, brief, id, coverImageId }: PostType) => {
  return (
    <List.Item
      key={title}
      actions={[
        <Space key='post-at'>{moment(date).format('yyyy-MM-DD')}</Space>,
        <Space key='comments'>
          <MessageOutlined /> {comments}
        </Space>,
        <Space key='post-keywords'>
          {keywords.map(kw => (
            <Tag key={kw} className='select-none'>
              {kw}
            </Tag>
          ))}
        </Space>,
      ]}
      extra={coverImageId && <Image width={272} alt='cover' src={coverImageId}></Image>}
    >
      <List.Item.Meta title={<Link href={`/blog/${id}`}>{title}</Link>} />
      {brief}
    </List.Item>
  );
};

const Blog: NextPage<ServerSideProps> = ({ files }) => {
  return (
    <>
      <Head>
        <meta name='og:title' content={'博客 | ' + SiteConfig.title} />
        <title>博客 | {SiteConfig.title}</title>
        <meta name='og:type' content='website' />
        {process.env.APP_ENV === 'production' && (
          <meta name='og:url' content={process.env.NEXT_PUBLIC_BASE_URL + '/blog'} />
        )}
        <meta name='og:locale' content='zh_CN' />
        <meta property='og:description' content="Woodykaixa's personal website. Blog, personal net dist, etc." />
      </Head>
      <div className='bg-white p-6 flex flex-col items-center mt-8'>
        <div className='flex flex-col w-3/4 items-center'>
          <List
            className='w-full'
            header={
              <Form
                onFinish={e => {
                  console.log(e);
                }}
              >
                <Form.Item name='search' label='搜索'>
                  <div className='flex'>
                    <Mentions
                      autoSize={{ maxRows: 1, minRows: 1 }}
                      className='flex-1'
                      placeholder='输入元标签以搜索文章'
                    >
                      {SearchTags.map(tag => (
                        <Mentions.Option key={tag} value={tag}>
                          {tag}
                        </Mentions.Option>
                      ))}
                    </Mentions>
                    <Button type='primary' icon={<SearchOutlined />} htmlType='submit'></Button>
                  </div>
                </Form.Item>
              </Form>
            }
            itemLayout='vertical'
            size='large'
            pagination={{
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
    </>
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
