import { GetServerSideProps, NextPage } from 'next';
import { Form, Input, Button, notification } from 'antd';
import Image from 'next/image';
import { GitHubState } from '@/util';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { raiseError } from '@/util/api';
import { CreateUserDTO, GetUserInfoResp, CreateUserResp, CommonAPIErrorResponse } from '@/dto';

const Login: NextPage<GetUserInfoResp & { state: string }> = query => {
  useStateCheck(query.state);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm<CreateUserDTO>();
  const submit = () => {
    setUploading(true);
    const body = form.getFieldsValue();
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then((result: CreateUserResp) => {
        // ugly fix type error, but why?
        if ((result as CommonAPIErrorResponse).error) {
          raiseError(result as any);
        }
        notification.success({
          message: '注册成功',
          description: '一起来玩吧!',
        });
        console.log('register result', result);
      })
      .catch((err: Error) => {
        notification.error({
          message: err.name,
          description: err.message,
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div className='bg-white p-8 mt-16 mx-8 flex justify-center'>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        autoComplete='on'
        className='items-center p-4 max-w-5xl w-full'
        initialValues={{
          name: query.login,
          email: query.email,
          bio: query.bio,
          blog: query.blog,
          github_id: query.id,
        }}
        form={form}
      >
        <Form.Item className='flex justify-center'>
          <div className='flex justify-center'>
            <Image src={query.avatar_url} alt='avatar' width={100} height={100} className='rounded-full'></Image>
          </div>
        </Form.Item>
        <Form.Item
          label='君の名は。'
          name='name'
          required
          rules={[
            {
              required: true,
              max: 20,
              message: '名字没必要那么长吧?',
            },
          ]}
        >
          <Input disabled={uploading} />
        </Form.Item>

        <Form.Item name='github_id' hidden>
          <Input value={query.id} disabled />
        </Form.Item>

        <Form.Item
          label='密码'
          name='password'
          required
          rules={[
            { required: true, message: '你得输入密码呀' },
            { min: 6, message: '是不是太短了?' },
            { max: 20, message: '也没必要这么长吧, 记得住吗?' },
          ]}
        >
          <Input.Password disabled={uploading} />
        </Form.Item>

        <Form.Item
          label='确认密码'
          name='confirm'
          hasFeedback
          dependencies={['password']}
          required
          rules={[
            { required: true, message: '你得再输一遍' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password disabled={uploading} />
        </Form.Item>

        <Form.Item label='电子邮箱' name='email' required rules={[{ type: 'email', required: true }]}>
          <Input disabled={uploading} />
        </Form.Item>

        <Form.Item label='你的主页' name='blog' rules={[{ type: 'url' }]}>
          <Input disabled={uploading} />
        </Form.Item>

        <Form.Item label='Bio' name='bio' rules={[{ max: 200, message: '太长了，数据库放不下了!' }]}>
          <Input.TextArea
            disabled={uploading}
            rows={5}
            className=' resize-none'
            placeholder='快来分享你有趣的灵魂⑧ !'
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
          <Button type='primary' onClick={submit} loading={uploading}>
            立即注册
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
  //     id: 22990333,
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
