import { GetServerSideProps, NextPage } from 'next';
import { Form, Input, Button, notification, Alert } from 'antd';
import { GitHubState } from '@/util';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User, GetUserInfoResp, Err, OK } from '@/dto';
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

const Login: NextPage<GetUserInfoResp & { state: string }> = query => {
  useStateCheck(query.state);
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
        if (res.ok) {
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
        initialValues={{
          name: query.login,
          email: query.email,
          bio: query.bio,
          blog: query.blog,
          github_id: query.id,
        }}
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
            <AvatarUploader img={query.avatar_url} width={250} height={250} form={form} />
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
          <Button type='primary' htmlType='submit' loading={uploading}>
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
    const response = await fetch(SiteConfig.url + '/api/github/get-token?code=' + query.code);
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
    const res = await fetch(SiteConfig.url + '/api/github/get-user-info?token=' + json.access_token);
    const user_info = await res.json();
    console.log('res', user_info);
    const getUserResp = await fetch(SiteConfig.url + '/api/user/get?githubId=' + user_info.id, {
      headers: {
        'content-type': 'application/json',
      },
    });
    const user = (await getUserResp.json()) as User.GetDTO;
    console.log('user', user);
    if (getUserResp.status === OK.code) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }
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
