import React from "react";
import { Grid } from "@material-ui/core";

export default ({ clusterName, topicData }) => {
  const authorizedOperations = topicData.description.authorizedOperations
    .map(ao => (ao.unknown ? `${ao.code} (unknown)` : ao.code))
    .sort()
    .map(ao => <li key={ao}>{ao}</li>);

  return <Grid container spacing={2}>
    <Grid item xs={6}>
      <p>Name: {topicData.name}</p>
      <p>Cluster: {clusterName}</p>
      <p>Partitions: {topicData.offsets.partitionCount}</p>
      <p>Consumer Groups: {topicData.consumerGroups.length}</p>
      <p>Internal: {topicData.internal ? "Yes" : "No"}</p>
      <p>Offsets: {topicData.offsets.offsetCount} <span className="smaller">({topicData.offsets.lifetimeOffsetCount} total)</span></p>
    </Grid>
    <Grid item xs={6}>
      <p>Authorized Operations:</p>
      <ul>{authorizedOperations}</ul>
    </Grid>
  </Grid>
}
