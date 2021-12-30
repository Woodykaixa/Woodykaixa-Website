import '../styles/globals.css';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import type { AppProps } from 'next/app';
import { SiteConfig } from '../config';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{SiteConfig.title}</title>
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
