import { GetServerSideProps, NextPage } from 'next';
import { Form, Input, Button, notification, Alert } from 'antd';
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { User, Err, OK, Gh } from '@/dto';
import { AvatarUploader } from '@/components/AvatarUploader';
import { HttpError } from '@/util/error';
import { SiteConfig } from '@/config/site';
import { JwtConfig } from '@/config/jwt';
import { firstValue } from '@/util/api';

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

function useUploading(callback: string | null) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm<User.AddDTO>();
  const submit = (values: User.AddDTO) => {
    setUploading(true);
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
        setUploading(false);
        if (callback) {
          router.push(callback);
        }
      })
      .catch((err: Error) => {
        const notificationTexts = ReadableErrorTexts[err.message] ?? {
          message: err.name,
          description: err.message,
        };
        console.error(err);
        notification.error(notificationTexts);
        setUploading(false);
      });
  };

  return {
    form,
    uploading,
    submit,
  };
}

const Login: NextPage<Props> = ({ callback }) => {
  const { form, uploading, submit } = useUploading(callback);

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
        <Form.Item className='flex justify-center' name='avatarSize'></Form.Item>
        <Form.Item className='flex justify-center' name='avatar'>
          <div className='flex justify-center'>
            {<AvatarUploader avatarSize={SiteConfig.avatarSize / 2} form={form} loading={uploading} />}
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

export default Login;

type Props = {
  callback: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  return {
    props: {
      callback: firstValue(ctx.query.cb ?? null),
    },
  };
};
