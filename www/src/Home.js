import React, { useEffect, useState } from "react";
import {Paper, makeStyles, Grid, Link} from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import querySamples from "./documentation/querying-graphql.md";
import CodeBlock from "./settings/CodeBlock";
import Settings from "./settings/Settings";

const useStyles = makeStyles({
  paddedTable: {
    padding: "20px",
  },
  wide: {
    width: "100%"
  },
  root: {
    flexGrow: 1,
    width: "100%"
  }
});

export default function Home() {
  const classes = useStyles();
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
      <h1>Welcome!</h1>
      <Paper className={classes.paddedTable}>
        <p>This site relies heavily on a GraphQL interface, which you can interact with directly via <Link href={Settings.queryUiUrl} target="queryUi">this link</Link>.</p>
        <p>Please note that this is hitting an API, and some of the calls take a while to complete.</p>
        <ReactMarkdown source={text} renderers={{ code: CodeBlock }} />
      </Paper>
    </React.Fragment>
  );
}
