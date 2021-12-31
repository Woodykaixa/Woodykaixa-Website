import { GetServerSideProps, NextPage } from 'next';
import { Form, Input, Button } from 'antd';
import Image from 'next/image';
import { GitHubAPI, GitHubState } from '../../util';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login: NextPage = (query: any) => {
  useStateCheck(query.state);
  return (
    <div className='bg-white p-8 mt-16 mx-8'>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} autoComplete='on' className='items-center p-4'>
        <Form.Item className='flex justify-center'>
          <div className='flex justify-center'>
            <Image src={query.avatar_url} alt='avatar' width={100} height={100} className='rounded-full'></Image>
          </div>
        </Form.Item>
        <Form.Item label='Username'>
          <Input disabled value={query.login} />
        </Form.Item>

        <Form.Item label='Email'>
          <Input value={query.email} />
        </Form.Item>

        <Form.Item label='Blog'>
          <Input value={query.blog} />
        </Form.Item>

        <Form.Item label='Bio'>
          <Input value={query.bio} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
          <Button type='primary' htmlType='submit' disabled>
            立即注册
          </Button>
          <Button htmlType='button' className='ml-4'>
            放弃注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

function useStateCheck(state: string) {
  const router = useRouter();
  useEffect(() => {
    if (state !== GitHubState.get()) {
      router.push({
        pathname: '/error',
        query: {
          err: 'state mismatch',
          desc: `${state} !== ${GitHubState.get()}. Maybe you are under a cross-site attack?`,
        },
      });
    } else {
      localStorage.removeItem('GITHUB_OAUTH_STATE');
    }
  }, [state, router]);
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  // return {
  //   props: {
  //     login: 'Woodykaixa',
  //     avatar_url: 'https://avatars.githubusercontent.com/u/22990333?v=4',
  //     html_url: 'https://github.com/Woodykaixa',
  //     company: 'Beijing University of Technology',
  //     blog: 'https://woodykaixa.github.io',
  //     location: 'Beijing',
  //     email: '690750353@qq.com',
  //     bio: 'BJUT大四本科生，信息安全专业。\r\n你相信引力吗？',
  //   },
  // };
  const { query } = ctx;
  if (ctx.query.error) {
    return {
      redirect: {
        destination: `/error?err=${query.error}&desc=${query.error_description}`,
        permanent: false,
      },
    };
  }
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/github/get-token?code=' + query.code);
    const json = await response.json();
    console.log(json);
    if (json.error) {
      return {
        redirect: {
          destination: `/error?err=${json.error}&desc=${json.desc}&se=true`,
          permanent: false,
        },
      };
    }
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/github/get-user-info?token=' + json.access_token);
    const user_info = await res.json();
    console.log('res', user_info);
    return {
      props: { ...user_info, state: ctx.query.state },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        redirect: {
          destination: `/error?err=${err.name}&desc=${err.message}&se=true`,
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: `/error?err=${'Error Occurred'}&desc=${err}&se=true`,
        permanent: false,
      },
    };
  }
};

export default Login;
