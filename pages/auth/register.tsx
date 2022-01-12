import { GetServerSideProps, NextPage } from 'next';
import { Form, Input, Button, notification, Alert } from 'antd';
import { GitHubState } from '@/util';
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { User, Err, OK, Gh } from '@/dto';
import { AvatarUploader } from '@/components/AvatarUploader';
import { HttpError } from '@/util/error';
import { SiteConfig } from '@/config/site';

const ReadableErrorTexts: Record<string, { description: string; message: string }> = {
  'User exists': {
    description: '请直接登录',
    message: '该用户已注册',
  },
  'Email exists': {
    description: '邮箱用于接收网站推送以及评论，因此不允许重复注册',
    message: '该邮箱已被注册',
  },
};

function useUploading() {
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm<User.AddDTO>();
  const submit = (values: User.AddDTO) => {
    setUploading(true);
    // const formData = new FormData();
    // const avatarBuffer = Buffer.from(values.avatar.split(',')[1], 'base64');

    // formData.append('github_id', values.github_id.toString(10));
    // formData.append('email', values.email);
    // formData.append('name', values.name);
    // formData.append('password', values.password);
    // formData.append('blog', values.blog ?? '');
    // formData.append('bio', values.bio ?? '');
    // formData.append('avatar', new Blob([new Uint8Array(avatarBuffer)]));
    console.log(values);
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(async res => {
        const json = await res.json();
        if (res.status === OK.code) {
          return json as User.AddResp;
        }
        const jErr = json as Err.CommonResp;
        const err = new HttpError(jErr.desc, res.status);
        err.name = jErr.error;
        throw err;
      })
      .then(result => {
        notification.success({
          message: '注册成功',
          description: '一起来玩吧!',
        });
        console.log('register result', result);
      })
      .catch((err: Error) => {
        const notificationTexts = ReadableErrorTexts[err.message] ?? {
          message: err.name,
          description: err.message,
        };
        console.error(err);
        notification.error(notificationTexts);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return {
    form,
    uploading,
    submit,
  };
}

function useUserInfo() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Err.CommonResp | null>(null);
  const [data, setData] = useState<Omit<User.AddDTO, 'password'> | null>(null);
  useEffect(() => {
    (async () => {
      if (!router.query.code) {
        return;
      }
      try {
        const getTokenResp = await fetch(SiteConfig.url + '/api/github/get-token?code=' + router.query.code);
        const getTokenResult = (await getTokenResp.json()) as Gh.GetTokenResp;
        console.log(getTokenResult);
        if (getTokenResp.status !== OK.code) {
          throw retrieveError(getTokenResult as any, getTokenResp.status);
        }
        const getUserInfoResp = await fetch(
          SiteConfig.url + '/api/github/get-user-info?token=' + getTokenResult.access_token
        );
        const getUserInfoResult = (await getUserInfoResp.json()) as Gh.GetUserInfoResp;
        console.log(getUserInfoResult);
        if (getUserInfoResp.status !== OK.code) {
          throw retrieveError(getUserInfoResult as any, getUserInfoResp.status);
        }
        const loginResp = await fetch(SiteConfig.url + '/api/user/login?githubId=' + getUserInfoResult.id, {
          headers: {
            'content-type': 'application/json',
          },
        });
        if (loginResp.status === OK.code) {
          const { jwt } = (await loginResp.json()) as User.LoginResp;
          router.replace({
            pathname: '/auth/login',
            query: { jwt },
          });
          setData(null);
        } else {
          setData({
            avatar: getUserInfoResult.avatar_url,
            bio: getUserInfoResult.bio,
            blog: getUserInfoResult.blog,
            email: getUserInfoResult.email,
            github_id: getUserInfoResult.id,
            name: getUserInfoResult.login,
          });
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? {
                error: err.name,
                desc: err.message,
              }
            : {
                error: 'Error occurred',
                desc: err as any,
              }
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [router.query.code, router]);

  return {
    loading,
    data,
    error,
  };
}

function useInner() {
  const { form, uploading, submit } = useUploading();
  const { data, error, loading } = useUserInfo();
  if (data) {
    form.setFieldsValue(data);
  }
  return {
    form,
    formDisabled: loading || uploading,
    loading,
    data,
    submit,
    error,
  };
}

function retrieveError(error: Err.CommonResp, code: number) {
  const err = new HttpError(error.desc, code);
  err.name = error.error;
  return err;
}

const Login: NextPage<{
  code: string;
  state: string;
}> = query => {
  useStateCheck(query.state);
  const { form, formDisabled, error, submit, data, loading } = useInner();
  useLayoutEffect(() => {
    if (error) {
      notification.error({
        message: error.error,
        description: error.desc,
      });
    }
  }, [error]);
  return (
    <div className='bg-white p-8 mt-16 mx-8 flex flex-col items-center justify-center'>
      <Alert
        message='我需要现在注册吗？'
        description='即使未注册用户也可以浏览本站的全部内容，只有需要评论以及添加友链时才需要注册。'
        type='info'
        showIcon
        closable
      />
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        autoComplete='on'
        className='items-center p-4 max-w-5xl w-full'
        form={form}
        onFinish={submit}
      >
        <Form.Item
          className='flex justify-center'
          name='avatar'
          getValueFromEvent={(...args) => {
            console.log(...args);
          }}
        >
          <div className='flex justify-center'>
            {data && <AvatarUploader img={data.avatar} width={250} height={250} form={form} />}
            {/* <Image src={query.avatar_url} alt='avatar' width={100} height={100} className='rounded-full'></Image> */}
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
          <Input disabled={formDisabled} />
        </Form.Item>

        <Form.Item name='github_id' hidden>
          <Input disabled />
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
          <Input.Password disabled={formDisabled} />
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
          <Input.Password disabled={formDisabled} />
        </Form.Item>

        <Form.Item label='电子邮箱' name='email' required rules={[{ type: 'email', required: true }]}>
          <Input disabled={formDisabled} />
        </Form.Item>

        <Form.Item label='你的主页' name='blog' rules={[{ type: 'url' }]}>
          <Input disabled={formDisabled} />
        </Form.Item>

        <Form.Item label='Bio' name='bio' rules={[{ max: 200, message: '太长了，数据库放不下了!' }]}>
          <Input.TextArea
            disabled={formDisabled}
            rows={5}
            className=' resize-none'
            placeholder='快来分享你有趣的灵魂⑧ !'
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
          <Button type='primary' htmlType='submit' loading={formDisabled ? false : loading} disabled={formDisabled}>
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

export default Login;

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      code: ctx.query.code,
      state: ctx.query.state,
    },
  };
};
