import { Button } from 'antd';
import * as React from 'react';
import { SiteConfig } from '@/config/site';
import { GitHubAPI, GitHubState } from '@/util/github';

export function LoginPanel() {
  return (
    <div className='w-60 bg-white rounded-lg shadow-md p-4 flex flex-col items-center'>
      <p>您尚未登录。即便如此，您依然可以浏览{SiteConfig.title}的全部内容。</p>
      <p>本站的用户系统基于 GitHub 的 OAuth2 授权机制，仅用于添加友情链接和评论时的非机器人验证。</p>
      <Button
        className='w-full'
        type='primary'
        onClick={() => {
          const state = GitHubState.get();
          const a = document.createElement('a');
          a.href = GitHubAPI.registerUrl(state);
          a.click();
        }}
      >
        使用 GitHub 账号登录
      </Button>
    </div>
  );
}
