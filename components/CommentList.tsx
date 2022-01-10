import { Comment, Tooltip, List, Spin, Alert, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import { MarkdownOptions } from '@/config/markdown';

const data = [
  {
    actions: [<span key='comment-list-reply-to-0'>Reply to</span>],
    author: 'Woodykaixa',
    avatar: 'https://kaixa-development-bucket.oss-cn-beijing.aliyuncs.com/AVATAR/Woodykaixa-avatar-0',
    content: <Markdown options={MarkdownOptions}>站长当然会使用 mock 数据假装有评论区啦！</Markdown>,
    datetime: (
      <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().subtract(1, 'days').fromNow()}</span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key='comment-list-reply-to-0'>Reply to</span>],
    author: 'Woodykaixa',
    avatar: 'https://kaixa-development-bucket.oss-cn-beijing.aliyuncs.com/AVATAR/Woodykaixa-avatar-0',
    content: (
      <Markdown options={MarkdownOptions}>
        {
          '站长的评论区当然也可也使用扩展的 Markdown 啦！\n<hid children={<a href="https://zh.moegirl.org.cn/%E4%BD%A0%E9%80%A2%E7%94%B0%E5%A7%90%E5%BD%93%E7%84%B6%E4%BC%9Aoo%E5%91%80">出处</a>} />'
        }
      </Markdown>
    ),
    datetime: (
      <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().subtract(1, 'days').fromNow()}</span>
      </Tooltip>
    ),
  },
];

export function CommentList() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <>
      {!loading && (
        <List
          className='comment-list w-full'
          header={
            <>
              <Typography.Title level={2} className='mt-4'>
                评论区
              </Typography.Title>
              {data.length} 条评论
            </>
          }
          itemLayout='horizontal'
          dataSource={data}
          renderItem={item => (
            <li>
              <Comment
                actions={item.actions}
                author={item.author}
                avatar={item.avatar}
                content={item.content}
                datetime={item.datetime}
              />
            </li>
          )}
        />
      )}
      {loading && (
        <Spin tip='Loading...'>
          <Alert message='评论加载中' description='Further details about the context of this alert.' type='info' />
          <List
            className='comment-list w-full'
            header={`${data.length} replies`}
            itemLayout='horizontal'
            dataSource={[]}
          />
        </Spin>
      )}
    </>
  );
}
