import '@/styles/globals.css';
import 'antd/dist/antd.css';
import '@/styles/override.css';
import Layout from '@/components/Layout';
import type { AppProps } from 'next/app';
import { SiteConfig } from '@/config/site';
import Head from 'next/head';
import { UserInfoContext } from '@/util/context/useUserContext';
import { GlobalStateContext } from '@/util/context/useGlobalState';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{SiteConfig.title}</title>
      </Head>

      <GlobalStateContext>
        <UserInfoContext>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserInfoContext>
      </GlobalStateContext>
    </>
  );
}

export default MyApp;
