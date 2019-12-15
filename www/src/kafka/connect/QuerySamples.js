import React, {useEffect, useState} from "react";
import Settings from "../../settings/Settings";
import ReactMarkdown from "react-markdown";
import querySamples from "../../documentation/graphql-connect.md";
import CodeBlock from "../../settings/CodeBlock";

export default function Home() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch(querySamples)
      .then(response => response.text())
      .then(text => {
        setText(text);
      });
  }, []);

  return (
    <React.Fragment>
      <h1>
        <Settings.icons.Connect /> Connect GraphQL Examples
      </h1>

      <ReactMarkdown source={text} renderers={{ code: CodeBlock }} />

    </React.Fragment>
  );
}
