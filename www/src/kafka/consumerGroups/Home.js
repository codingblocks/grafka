import React, { useState, useEffect } from "react";
import RefreshButton from "../../RefreshButton";
import Grid from "./Grid";
import CachedGraphQLRequester from "../../GraphQL";
import Settings from "../../settings/Settings";

export default function Home({ match: { params: {clusterId} }} ) {
  const graphql = CachedGraphQLRequester({
    key: `kafka-${clusterId}-consumerGroups`,
    query: `query ($clusterId:ID) {
      clusters(clusterId: $clusterId) {
        name
        consumerGroupListings {
          clusterId
          groupId
          simpleConsumerGroup
          offsets {
            topicName
            partition
            offset
          }
        }
      }
    }`,
    variables: { clusterId },
    setData: d => setData(d),
    failure: e => setErrorMessage(e)
  });
  const [data, setData] = useState(graphql.initialData());
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => { graphql.refresh() }, []); // TODO warning!?

  const results = data.results ? data.results : { clusters: [] };
  const cluster = results.clusters.length ? results.clusters[0] : {consumerGroupListings: []};
  const consumerGroupListings = cluster.consumerGroupListings;

  return (
    <React.Fragment>
      <h1><Settings.icons.ConsumerGroups /> {`${cluster.name}`}</h1>
      {/*TODO actually fix the errorMessage {} thing*/}
      <p hidden={!errorMessage || errorMessage === "{}"}>{errorMessage}</p>
      <Grid results={consumerGroupListings} dataChangeHandler={graphql.refresh} />
      <RefreshButton date={data.date} refreshAction={graphql.refresh} loading={data.loading} />
    </React.Fragment>
  );
}
