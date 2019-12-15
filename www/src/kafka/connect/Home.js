import React, { useState, useEffect } from "react";
import RefreshButton from "../../RefreshButton";
import Grid from "./Grid";
import CachedGraphQLRequester from "../../GraphQL";
import Settings from '../../settings/Settings'

export default function Home() {
  const graphql = CachedGraphQLRequester({
    key: `kafka-connect`,
    query: `{
    connect {
      connectId
      name
      config
      plugins {
        className
        type
        version
      }
      connectors {
        name
        status {
          name
          type
          connector {
            state
          }
          tasks {
            state
          }
        }
      }
    }
  }`,
    setData: d => setData(d),
    failure: e => setErrorMessage(e)
  });
  const [data, setData] = useState(graphql.initialData());
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    graphql.refresh()
  }, []); // TODO warning!?

  const results = (data.results && data.results.connect) ? data.results.connect : [];

  return (
    <React.Fragment>
      <h1><Settings.icons.Connect /> Connect Instances</h1>
      {/*TODO actually fix the errorMessage {} thing*/}
      <p hidden={!errorMessage || errorMessage === "{}"}>{errorMessage}</p>
      <Grid results={results} dataChangeHandler={graphql.refresh} />
      <RefreshButton date={data.date} refreshAction={graphql.refresh} loading={data.loading} />
    </React.Fragment>
  );
};
