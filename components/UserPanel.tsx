import { Button } from 'antd';
import * as React from 'react';
import { GitHubAPI, GitHubState } from '../util/github';

export function UserPanel() {
  return (
    <div className='w-60 bg-white rounded-lg shadow-md p-4 flex flex-col items-center'>
      <p>您尚未登录。可以浏览文章，但是评论功能不可用。</p>
      <p>请登录以体验卡夏妙妙屋的全部功能。</p>
      <div className='flex flex-col items-center w-4/5'>
        <Button type='primary' className='w-full'>
          点击登录
        </Button>
        <div>或</div>
        <Button
          className='w-full'
          onClick={() => {
            const state = GitHubState.get();
            const a = document.createElement('a');
            a.href = GitHubAPI.registerUrl(state);
            a.click();
          }}
        >
          使用 GitHub 账号注册
        </Button>
      </div>
    </div>
  );
}
