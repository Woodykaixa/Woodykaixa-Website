import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { notification, Alert } from 'antd';
import { useEffect } from 'react';
import { SiteConfig } from '@/config/site';
import { Err, OK, Oss } from '@/dto';
import { CommentList } from '@/components/CommentList';
import { SEOHeaders } from '@/components/SEOHeaders';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import { Typography } from 'antd';
import { Code } from './markdown/Code';
import { Hidden } from './markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
const { Title, Paragraph, Text, Link } = Typography;

export type MarkdownViewerProps = {
  children: string;
  tableOfContent?: boolean;
  components: MarkdownOverrideComponents;
};

export type MarkdownOverrideComponents = ReactMarkdownOptions['components'];

export function MarkdownViewer({ children, tableOfContent = false, components }: MarkdownViewerProps) {
  const remarkPlugins = [remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype] as any;
  if (tableOfContent) {
    remarkPlugins.push(remarkToc);
  }
  return (
    <Typography>
      <Markdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </Markdown>
    </Typography>
  );
}
