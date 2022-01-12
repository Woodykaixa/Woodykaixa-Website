import { JwtConfig } from '@/config/jwt';
import { firstValue } from '@/util/api';
import { message, Spin, Result } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useUserInfo } from '@/util/context/useUserContext';
import { OK } from '@/dto';

export default function LoginPage() {
  const router = useRouter();
  const [, { fetchUser }] = useUserInfo();
  useEffect(() => {
    const jwt = router.query[JwtConfig.COOKIE_KEY];
    console.log(jwt);
    if (jwt) {
      localStorage.setItem(JwtConfig.COOKIE_KEY, firstValue(jwt));
      localStorage.removeItem('GITHUB_OAUTH_STATE');
      console.log('fetchUser');
      fetchUser('').then(result => {
        if (result.error === OK.text) {
          message.success('登录成功，正在转跳……', 3, () => {
            router.replace('/');
          });
        } else {
          message.error('获取用户信息失败');
          console.error(result);
        }
      });
    }
  }, [router, fetchUser]);
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
