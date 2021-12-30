import { useState, ReactNode } from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { UserPanel } from './UserPanel';
const { Header, Content, Footer } = Layout;

export default function AppLayout({ children }: { children: ReactNode }) {
  const [currentMenuItem, setCurrentMenuItem] = useState('index');

  return (
    <Layout>
      <Header className='fixed z-10 w-full '>
        <div className='flex h-full'>
          <div className='text-white  mr-6'>
            <Link href='/'>
              <a
                className='text-white hover:text-white opacity-80 hover:opacity-100 ease-linear duration-100 transition'
                onClick={() => {
                  setCurrentMenuItem('index');
                }}
              >
                卡夏妙妙屋
              </a>
            </Link>
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
              <Link href='/blog'>博客</Link>
            </Menu.Item>
            <Menu.Item key='3'>
              <Link href='/friends'>友情链接</Link>
            </Menu.Item>
            <Menu.Item key='4'>
              <Link href='/me'>关于我</Link>
            </Menu.Item>
          </Menu>
          <Dropdown placement='bottomRight' trigger={['click']} overlay={<UserPanel></UserPanel>}>
            <GithubOutlined className='bg-white invert filter rounded-full my-3' style={{ fontSize: 40 }} />
          </Dropdown>
        </div>
      </Header>
      <Content className='px-12 py-0 mt-16'>{children}</Content>
      <Footer className='text-center'>
        <a href='https://beian.miit.gov.cn/' target='_blank' rel='noreferrer'>
          京ICP备20006005号
        </a>
        <p>
          ©2021 Created by{' '}
          <a href='https://github.com/Woodykaixa' target='_blank' rel='noreferrer'>
            Woodykaixa
          </a>
        </p>
      </Footer>
    </Layout>
  );
}
