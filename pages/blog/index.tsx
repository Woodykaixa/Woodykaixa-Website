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
import { SEOHeaders } from '@/components/SEOHeaders';
import { useGlobalStates } from '@/util/context/useGlobalState';
import { useRouter } from 'next/router';

const { Search } = Input;
type PostType = Blog.ListResp[number];

const Post = ({ title, date, keywords, comments, brief, id, coverImageUrl }: PostType) => {
  const actions = [
    <Space key='post-at'>{moment(date).format('yyyy-MM-DD')}</Space>,
    <Space key='comments'>
      <MessageOutlined /> {comments}
    </Space>,
  ];
  if (keywords.length > 0) {
    actions.push(
      <Space key='post-keywords'>
        {keywords.map(kw => (
          <Tag key={kw} className='select-none'>
            {kw}
          </Tag>
        ))}
      </Space>
    );
  }
  const router = useRouter();
  const [, { setLoading }] = useGlobalStates();
  return (
    <List.Item
      className='blog-list-item-main'
      key={title}
      actions={actions}
      extra={
        coverImageUrl && (
          <Image width={'100%'} alt='cover' src={coverImageUrl} height={'100%'} objectFit='contain'></Image>
        )
      }
    >
      <List.Item.Meta
        title={
          <Link href={`/blog/${id}`} passHref>
            <a
              onClick={e => {
                e.preventDefault();
                setLoading(true);
                router.push(`/blog/${id}`).then(() => setLoading(false));
              }}
            >
              {title}
            </a>
          </Link>
        }
      />
      {brief}
    </List.Item>
  );
};

const Blog: NextPage<ServerSideProps> = ({ files }) => {
  return (
    <>
      <SEOHeaders.Index title='博客' description="Woodykaixa's blog" url='/blog' />
      <div className='bg-white p-2 md:p-6 flex flex-col items-center mt-0 md:mt-8'>
        <div className='flex flex-col w-full lg:w-3/4 items-center'>
          <List
            className='w-full'
            header={
              <Form
                onFinish={e => {
                  console.log(e);
                }}
              >
                <Form.Item name='search'>
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
              <div className='px-2'>
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
  const posts = (await postResponse.json()) as Blog.ListResp;
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
