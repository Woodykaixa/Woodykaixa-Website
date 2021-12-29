import { Button } from 'antd';
import * as React from 'react';
import { GithubAPI } from '../util/github-api';

export function UserPanel() {
  return (
    <div className='w-60 bg-white rounded-lg shadow-md p-4'>
      <div>被你发现了！</div>
      <div>登录UI还没做，登录还没做，打算直接跟 GitHub 绑定</div>
      <Button
        type='primary'
        onClick={() => {
          const url = GithubAPI.getLoginUrl('123');
          const a = document.createElement('a');
          a.href = url;
          a.click();
        }}
      >
        点击登录
      </Button>
    </div>
  );
}
