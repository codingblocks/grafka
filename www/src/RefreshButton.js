import React from "react";
import {Button, makeStyles} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import Progress from "@material-ui/core/LinearProgress"


const useStyles = makeStyles({
  linearProgress: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    opacity: 0.1,
    borderRadius: 4
  }
});

export default function RefreshButton ({date, refreshAction, loading}) {
  const buttonText = date == null ? "Unknown" : date.toLocaleString();
  const classes = useStyles();
  return (
    <React.Fragment>
      <Button disabled={loading} startIcon={<RefreshIcon aria-hidden={loading} /> } onClick={refreshAction} >
        <Progress hidden={!loading} color="primary" className={classes.linearProgress} />
        {buttonText}
      </Button>
    </React.Fragment>
  );
};