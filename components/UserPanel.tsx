import * as React from 'react';
import { useUserInfo } from '@/util/context/useUserContext';
import { LoginPanel } from './LoginPanel';

import { Card, message, Tooltip } from 'antd';
import { EditOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
const { Meta } = Card;

export function UserPanel({ close }: { close: () => void }) {
  const [user, actions] = useUserInfo();
  const router = useRouter();
  const logout = () => {
    fetch('/api/user/logout')
      .then(res => {
        if (res.ok) {
          router.reload();
        } else {
          message.error('登出失败');
          throw res.text();
        }
      })
      .catch(err => {
        console.error('logout failed:', err);
      });
  };
  return (
    <>
      {!user && <LoginPanel close={close} />}
      {user && (
        <div className='w-60  rounded-lg shadow-md'>
          <Card
            style={{ width: 300 }}
            cover={<Image alt='avatar' src={user.avatar} width={250} height={250}></Image>}
            actions={[
              <Tooltip title='编辑个人信息' key='edit'>
                <EditOutlined />
              </Tooltip>,
              <Tooltip title='退出登录' key='logout'>
                <LogoutOutlined onClick={logout} />
              </Tooltip>,
            ]}
            className='w-full'
          >
            <Meta
              title={user.name}
              description={(user.bio ?? '').split('\n').map((content, index) => (
                <div key={index}>{content}</div>
              ))}
            />
          </Card>
        </div>
      )}
    </>
  );
}
