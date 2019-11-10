import React from "react";
import {Card, makeStyles, Typography} from "@material-ui/core";
import {AccessTime, VpnKey} from "@material-ui/icons";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../settings/CodeBlock";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  message: {
    padding: "20px",
    margin: "10px"
  },
  meta: {
    fontSize: "smaller",
    fontWeight: "lighter"
  },
  smallIcon: {
    fontSize: "smaller",
    fontWeight: "lighter"
  }
});

export default ({ message }) => {
  const {
    key,
    value,
    partition,
    offset,
    timestampType,
    timestamp
  } = message;
  const classes = useStyles();
  const formattedValue = "```json\n" + JSON.stringify(JSON.parse(value), null, 2) + "\n```";
  return (
    <Card className={classes.message}>
      <Grid container justify="space-between">
        <Typography inline align="left" color={"textSecondary"}><VpnKey className={classes.smallIcon}/> {key}</Typography>
      </Grid>
      <ReactMarkdown source={formattedValue} renderers={{ code: CodeBlock }} />
      <Grid container justify="space-between">
        <Typography inline align="left" className={classes.meta} color={"textSecondary"}>
          <AccessTime className={classes.smallIcon}/> {timestampType}{" "}{new Date(timestamp).toLocaleString()}
        </Typography>

        <Typography inline align="right" className={classes.meta} color={"textSecondary"}>P{partition} : {offset}</Typography>
      </Grid>
    </Card>
  );
};
