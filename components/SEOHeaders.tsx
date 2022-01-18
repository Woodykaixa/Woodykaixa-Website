import Head from 'next/head';
// https://moz.com/blog/meta-data-templates-123
import { SiteConfig } from '@/config/site';

export namespace SEOHeaders {
  export type ArticleHeadersProps = {
    title: string;
    description: string;
    image: string | null;
    id: string;
  };
  export function Article({ title, description, image, id }: ArticleHeadersProps) {
    const fullTitle = title + ' | ' + SiteConfig.title;

    return (
      <Head>
        <title>{fullTitle}</title>
        <meta name='description' content={description} />
        {/* Twitter Card data */}
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@RTMO_kaixa' />
        <meta name='twitter:title' content={fullTitle} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:creator' content='@RTMO_kaixa' />
        {image && <meta property='twitter:image' content={image} />}
        {/*  Open Graph data */}
        <meta property='og:title' content={title} />
        <meta property='og:type' content='article' />
        <meta property='og:url' content={SiteConfig.url + '/blog/' + id} />
        {image && <meta property='og:image' content={image} />}
        <meta property='og:description' content={description} />
        <meta property='og:site_name' content={SiteConfig.title} />
        {/* Schema.org markup for Google+ */}
        <meta itemProp='name' content={fullTitle} />
        <meta itemProp='description' content={description} />
        {image && <meta itemProp='image' content={image} />}
      </Head>
    );
  }
  export type IndexHeadersProps = {
    title?: string;
    description: string;
    url?: string;
  };

  export function Index({ title, description, url }: IndexHeadersProps) {
    const fullTitle = title ? `${title} | ${SiteConfig.title}` : SiteConfig.title;
    return (
      <Head>
        <meta name='og:title' content={fullTitle} />
        <title>{fullTitle}</title>
        <meta name='og:type' content='website' />
        {process.env.APP_ENV === 'production' && <meta name='og:url' content={SiteConfig.url + url ?? ''} />}
        <meta name='og:locale' content='zh_CN' />
        <meta property='og:description' content={description} />
      </Head>
    );
  }
}
