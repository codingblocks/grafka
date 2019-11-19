import React from "react";
import { Card, Container } from "@material-ui/core";

export default function Home({ clusterName, topicData }) {
  const authorizedOperations = topicData.description.authorizedOperations
    .map(ao => (ao.unknown ? `${ao.code} (unknown)` : ao.code))
    .join(", ");

  const partitions = topicData.description.partitions
    .map(p => {
      return {
        partition: p.partition,
        display: `P${p.partition} Leader: ${p.leader.id} ${p.leader.host}:${p.leader.port} Rack: ${p.leader.rack} Replicas: ${p.replicas.length} ISR: ${p.isr.length}`
      };
    })
    .sort(p => p.partition)
    .map(p => <ul key={p.partition}>{p.display}</ul>);

  // TODO source for sorting?
  const configs = topicData.configs.config
    .map(c => {
      let result = `${c.name}: ${c.value}`;
      if (c.readOnly) {
        result += " (read only)";
      }
      if (c.sensitive) {
        result += " (sensitive)";
      }
      if (!c.default) {
        result += " (not default!)";
      }
      if (c.synonyms.length) {
        result +=
          ` synonyms: ` +
          c.synonyms.map(s => `${s.name}:${s.value}`).join(", ");
      }
      return { source: c.source, key: c.name, value: result };
    })
    .sort(c => c.source + "-" + c.key)
    .map(c => <li key={c.key}>{c.value}</li>);

  // default: true
  //   name: "compression.type"
  //   readOnly: false
  //   sensitive: false
  //   source: "DEFAULT_CONFIG"
  //   synonyms: []
  //   value: "producer"
  return (
    <Card>
      <Container>
        <p>Internal: {topicData.internal ? "Yes" : "No"}</p>
        <p>Cluster: {clusterName}</p>

        <p>Partitions: {partitions.length}</p>
        <p>Consumer Groups: {topicData.consumerGroups.length}</p>

        <h3>Description</h3>
        <p>Authorized Operations: {authorizedOperations}</p>

        <p>Partitions:</p>
        <ul>{partitions}</ul>

        <p>Configs</p>
        <ul>{configs}</ul>

        <p>TODO</p>
        <ul>
          <li>Offset?</li>
          <li>Consumer Groups</li>
          <li>Schema Registry (optional)</li>
          <li>Postgres data, first / last date seen? Creator?</li>
        </ul>
      </Container>
    </Card>
  );
}
