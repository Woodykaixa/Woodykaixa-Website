import { Typography } from 'antd';
const { Text, Title, Paragraph, Link } = Typography;
import { Hidden } from '@/components/markdown';
import { Comment } from '@/components/markdown/Comment';
import { OmniImage } from '@/components/markdown/OmniImage';
import { Code } from '@/components/markdown/Code';

import type { MarkdownOverrideComponents } from '@/components/MarkdownViewer';

export const MinimalOptions: MarkdownOverrideComponents = {
  code: ({ children, inline, key, className }) => <Code {...{ className, inline, key }}>{children}</Code>,
  // @ts-ignore
  hid: ({ children }) => <Hidden>{children}</Hidden>,
  // @ts-ignore
  cmt: ({ children, cmt }) => <Comment comment={cmt}>{children}</Comment>,
};

export const AdminOptions: MarkdownOverrideComponents = {
  ...MinimalOptions,
  img: ({ alt, className, src = '' }) => <OmniImage alt={alt} src={src} className={className}></OmniImage>,
};
