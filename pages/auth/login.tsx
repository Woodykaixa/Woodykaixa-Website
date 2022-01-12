import { JwtConfig } from '@/config/jwt';
import { firstValue } from '@/util/api';
import { message, Spin, Result } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export default function LoginPage() {
  const router = useRouter();
  console.log(router.query);
  useEffect(() => {
    const jwt = router.query[JwtConfig.COOKIE_KEY];
    if (jwt) {
      localStorage.setItem(JwtConfig.COOKIE_KEY, firstValue(jwt));
      message.success('登录成功，正在转跳……', 3, () => {
        router.replace('/');
      });
    }
  }, [router]);
  return (
    <div className='m-16 flex justify-center'>
      <Result
        icon={<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} delay={200}></Spin>}
        title={'加载中，请稍候……'}
        className='p-24 bg-white py-44 w-full max-w-7xl'
      ></Result>
    </div>
  );
}
