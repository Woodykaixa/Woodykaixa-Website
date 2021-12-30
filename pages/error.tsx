import { Result, Button, Typography } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
const { Paragraph } = Typography;

export type ErrorPageProps = {
  reason: string;
  title: string;
  serverError: boolean;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ reason, title, serverError }) => {
  return (
    <div className='m-16 flex flex-col justify-center'>
      <Result
        status='error'
        title={title}
        subTitle={reason}
        className='p-24 bg-white py-44'
        extra={[
          <Button type='primary' key='console' href={'https://www.baidu.com'}>
            Retry
          </Button>,
          <Button key='buy' href='mailto:690750353@qq.com'>
            Contact author
          </Button>,
        ]}
      >
        {serverError ? (
          <Typography className='desc'>
            <Paragraph>你遇到了服务器内部错误，可能是由于服务器访问 GitHub 失败。</Paragraph>
            <Paragraph>站长也在找原因呢.jpg</Paragraph>
          </Typography>
        ) : (
          <Typography className='desc'>
            <Paragraph>看起来是因为站长的 GitHub App 设置有问题，才导致了登录失败。</Paragraph>
            <Paragraph>你可以考虑联系站长</Paragraph>
          </Typography>
        )}
      </Result>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { query } = ctx;
  return {
    props: {
      serverError: query.se === 'true',
      title: query.err,
      reason: query.desc,
    },
  };
};

export default ErrorPage;
