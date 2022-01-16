import { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedLight, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
export const Code = (props: { className: string; children: ReactNode }) => {
  console.log(props);
  const language = props.className.replace('lang-', '');

  return (
    <SyntaxHighlighter language={language} style={github}>
      {props.children}
    </SyntaxHighlighter>
  );
};
