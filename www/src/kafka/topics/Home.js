import React, { useState, useEffect } from "react";
import RefreshButton from "../../RefreshButton";
import Grid from "./Grid";
import CachedGraphQLRequester from "../../GraphQL";
import Settings from "../../settings/Settings";

export default function Home({ match: { params: {clusterId} }} ) {
  const graphql = CachedGraphQLRequester({
    key: `kafka-${clusterId}-topics`,
    query: `query($clusterId:ID) {
      clusters(clusterId: $clusterId) {
        clusterId
        name
        topicListings {
          clusterId
          name
          internal
          configs {
            config {
              name
              value
            }
          }
          description {
            partitions {
              partition
            }
          }
        }
      }
    }`,
    variables: {clusterId},
    setData: d => setData(d),
    failure: e => setErrorMessage(e)
  });

  const [data, setData] = useState(graphql.initialData());
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => { graphql.refresh() }, []); // TODO warning!?

  const clusterData = data && data.results && data.results.clusters
    ? data.results.clusters[0]
    : {topicListings: []};

  return (
    <React.Fragment>
      <h1><Settings.icons.Topics /> {`${clusterData.name}`}</h1>
      {/*TODO actually fix the errorMessage {} thing*/}
      <p hidden={!errorMessage || errorMessage === "{}"}>{errorMessage}</p>
      <Grid results={clusterData.topicListings} dataChangeHandler={graphql.refresh} />
      <RefreshButton date={data.date} refreshAction={graphql.refresh} loading={data.loading} />
    </React.Fragment>
  );
};
