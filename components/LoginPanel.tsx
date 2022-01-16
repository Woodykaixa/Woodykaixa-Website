import * as React from 'react';
import { SiteConfig } from '@/config/site';
import { Form, Input, Button, Checkbox, Alert, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserInfo } from '@/util/context/useUserContext';
import { Err, OK, User } from '@/dto';

export function LoginPanel({ close }: { close: () => void }) {
  const router = useRouter();
  const [, { setUser }] = useUserInfo();
  const login = async (values: { email: string; password: string }) => {
    const result = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const json = (await result.json()) as User.LoginResp;
    const err = json as unknown as Err.CommonResp;
    if (result.status !== OK.code) {
      notification.error({
        message: err.error,
        description: err.desc,
      });
    } else {
      setUser(json);
    }
  };

  const toRegister = () => {
    router.push({
      pathname: '/auth/register',
      query: {
        cb: router.asPath,
      },
    });
    close();
  };

  return (
    <div className='w-60 bg-white rounded-lg shadow-md p-4 flex flex-col items-center pt-12'>
      <Form className='w-full' onFinish={login}>
        <Form.Item
          name='email'
          rules={[
            {
              type: 'email',
              required: true,
              message: '请输入注册时填写的邮箱',
            },
          ]}
        >
          <Input prefix={<UserOutlined className='site-form-item-icon' />} type='email' placeholder=' 注册邮箱' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password' placeholder=' 密码' />
        </Form.Item>
        <Form.Item>
          <div className='flex flex-col items-center w-full'>
            <Button type='primary' htmlType='submit' className='w-full'>
              登录
            </Button>
            <div>或</div>
            <Button onClick={toRegister} type='text' className='hover:bg-white hover:text-blue-300 text-blue-400 '>
              立即注册
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
