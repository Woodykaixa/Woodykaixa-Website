import { useState, ReactNode, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Spin, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { UserPanel } from './UserPanel';
import { useUserInfo } from '@/util/context/useUserContext';
import { useGlobalStates } from '@/util/context/useGlobalState';
import { useRouter } from 'next/router';
import { Url } from 'url';
import { SiteConfig } from '@/config/site';

const { Header, Content, Footer } = Layout;

export default function AppLayout({ children }: { children: ReactNode }) {
  const [currentMenuItem, setCurrentMenuItem] = useState('index');
  const [user, { fetchUser }] = useUserInfo();
  const { visible, open, close } = useDropdown();
  const [{ loading }, { setLoading }] = useGlobalStates();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      console.log('try fetch user');
      fetchUser();
    }
    // Update jwt per 25 minutes, so we won't get expire
    setInterval(() => {
      fetchUser();
    }, 25 * 60 * 1000);
  }, [user, fetchUser]);
  const navigate = (url: string) => {
    setLoading(true);
    router.push(url).then(() => {
      setLoading(false);
    });
  };
  return (
    <Layout className='min-h-screen'>
      <Header className='fixed z-10 w-full flex flex-col'>
        <div className='flex h-full'>
          <div className='text-white  mr-6'>
            <Button
              className='text-white border-0 hover:text-white opacity-80 hover:opacity-100 ease-linear duration-100 transition bg-transparent'
              onClick={() => {
                setCurrentMenuItem('index');
                navigate('/');
              }}
            >
              {SiteConfig.title}
            </Button>
          </div>
          <Menu
            theme='dark'
            mode='horizontal'
            className='flex-1'
            selectedKeys={[currentMenuItem]}
            onClick={e => {
              setCurrentMenuItem(e.key);
            }}
          >
            <Menu.Item key='2'>
              <Link href='/blog'>
                <a
                  onClick={e => {
                    e.preventDefault();
                    navigate('/blog');
                  }}
                >
                  博客
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key='3'>
              <Link href='/friends'>
                <a
                  onClick={e => {
                    e.preventDefault();
                    navigate('/friends');
                  }}
                >
                  友情链接
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key='4'>
              <Link href='/me'>
                <a
                  onClick={e => {
                    e.preventDefault();
                    navigate('/me');
                  }}
                >
                  关于我
                </a>
              </Link>
            </Menu.Item>
          </Menu>
          <Dropdown placement='bottomRight' trigger={['click']} overlay={<UserPanel close={close} />}>
            {user ? (
              <div className='flex items-center cursor-pointer'>
                <Avatar src={user.avatar} size={40}></Avatar>
              </div>
            ) : (
              <UserOutlined
                className='bg-white invert filter rounded-full my-3'
                style={{ fontSize: 40 }}
                onClick={open}
              />
            )}
          </Dropdown>
        </div>
        <Spin className='mt-4' spinning={loading}></Spin>
      </Header>
      <Content className='px-12 py-0 mt-16'>{children}</Content>
      <Footer className='text-center'>
        <a href='https://beian.miit.gov.cn/' target='_blank' rel='noreferrer'>
          京ICP备20006005号
        </a>
        <p>
          ©2021-2022 Created by{' '}
          <a href='https://github.com/Woodykaixa' target='_blank' rel='noreferrer'>
            Woodykaixa
          </a>
          {' | '}
          <a href='https://github.com/Woodykaixa/Woodykaixa-Website' target='_blank' rel='noreferrer'>
            查看网站源代码
          </a>
        </p>
      </Footer>
    </Layout>
  );
}

function useDropdown() {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return {
    visible,
    open,
    close,
  };
}
