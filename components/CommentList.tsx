import { Comment, Tooltip, List, Spin, Alert, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const data = [
  {
    actions: [<span key='comment-list-reply-to-0'>Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design resources (Sketch and
        Axure), to help people create their product prototypes beautifully and efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().subtract(1, 'days').fromNow()}</span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key='comment-list-reply-to-0'>Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design resources (Sketch and
        Axure), to help people create their product prototypes beautifully and efficiently.
      </p>
    ),
    datetime: (
      <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().subtract(2, 'days').fromNow()}</span>
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
