import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
export default function({ language, value }) {
  const style = okaidia
  return <SyntaxHighlighter language={language} style={style}>
    {value}
  </SyntaxHighlighter>;
}
