import { Typography } from 'antd';
const { Text, Title, Paragraph, Link } = Typography;
import { MarkdownToJSX } from 'markdown-to-jsx';
import { Hidden, Title as MyTitle } from '@/components/markdown';
export const MarkdownOptions: MarkdownToJSX.Options = {
  wrapper: Typography,
  overrides: {
    h1: {
      component: MyTitle,
      props: {
        level: 1,
      },
    },
    h2: {
      component: Title,
      props: {
        level: 2,
      },
    },
    h3: {
      component: Title,
      props: {
        level: 3,
      },
    },
    h4: {
      component: Title,
      props: {
        level: 4,
      },
    },
    h5: {
      component: Title,
      props: {
        level: 5,
      },
    },
    link: {
      component: Link,
      props: {
        target: '_blank',
      },
    },
    del: {
      component: Text,
      props: {
        delete: true,
      },
    },
    p: {
      component: Paragraph,
    },
    br: {
      component: Paragraph,
    },
    Hidden: {
      component: Hidden,
    },
  },
};
