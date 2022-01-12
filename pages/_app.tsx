import '@/styles/globals.css';
import 'antd/dist/antd.css';
import '@/styles/override.css';
import Layout from '@/components/Layout';
import type { AppProps } from 'next/app';
import { SiteConfig } from '@/config/site';
import Head from 'next/head';
import { UserInfoContext } from '@/util/context/useUserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{SiteConfig.title}</title>
      </Head>

      <UserInfoContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserInfoContext>
    </>
  );
}

export default MyApp;
