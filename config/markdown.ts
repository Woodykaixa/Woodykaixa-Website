import { Typography, notification } from 'antd';
const { Text, Title, Paragraph, Link } = Typography;
import { MarkdownToJSX } from 'markdown-to-jsx';
export const IndexOptions: MarkdownToJSX.Options = {
  wrapper: Typography,
  overrides: {
    h1: {
      component: Title,
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
  },
};
