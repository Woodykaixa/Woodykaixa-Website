import { SiteConfig } from '@/config/site';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  console.log(router.query);
  return '登录成功';
}
