import React, { useState } from "react";
import Settings from "./settings/Settings";
import { Public } from "@material-ui/icons/";
import Button from "@material-ui/core/Button";

export default function() {
  const [hideFrame, setHideFrame] = useState(true);

  const console = hideFrame ? (
    <React.Fragment />
  ) : (
    <iframe
      src={Settings.queryUiUrl}
      width={"100%"}
      height={800}
      name="inline-graphiql"
    />
  );

  const buttonContent = hideFrame ? (
    <React.Fragment>
      <Public /> Open Query UI
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Settings.icons.Close /> Close Query UI
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Button
        key="queryui"
        aria-label="queryui"
        color="inherit"
        onClick={() => setHideFrame(!hideFrame)}
      >
        {buttonContent}
      </Button>
      {console}
    </React.Fragment>
  );
}