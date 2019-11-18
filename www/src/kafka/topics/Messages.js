import React from "react";
import gql from "graphql-tag";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Card} from "@material-ui/core";
import { useSubscription } from "@apollo/react-hooks";
import { withApollo } from "@apollo/react-hoc";
import Message from "./Message";

export const subscription = gql`
  subscription messages(
    $clusterId: ID!
    $topic: String!
    $latchSize: Int!
    $latchTimeoutMs: Int!
  ) {
    messages(
      clusterId: $clusterId
      topic: $topic
      latchSize: $latchSize
      latchTimeoutMs: $latchTimeoutMs
    ) {
        key
        value
        partition
        offset
        timestampType
        timestamp
        leaderEpoch
    }
  }
`;

// TODO configurable latch size, timeout, starting offset (first, last, last - x)
// TODO export? export to...?

export default withApollo(({ clusterId, topic, client }) => {
  // TODO hard-coded
  const sub = useSubscription(subscription, {
    variables: { clusterId, topic, latchSize: 100, latchTimeoutMs: 100 },
    shouldResubscribe: true,
    onSubscriptionData: () => {
      console.log(`onSubscriptionData`);
    }
  });

  const {messages} = sub.data || { messages: [] };
  const maxDisplaySize = 10;
  // how the heck can you unsubscribe?
  // control latch size / timeout

  return (
    <React.Fragment>
      <LinearProgress variant="query" hidden={!sub.loading} />
      <p hidden={!sub.loading}>This can take a while to start, even if the topic is empty...</p>
      <Card hidden={!sub.error} style={{margin: 10, padding: 20}}>
        <p>Error: {JSON.stringify(sub.error)}</p>
        <p>Note: what are your serde/deserde configs if you have a Schema Registry configured? There is currently a defect where all topics are assumed to use the same configuration defined at the cluster level.</p>
      </Card>
      <div hidden={sub.loading || sub.error}>
        {messages.filter((i, index) => (index < maxDisplaySize)).reverse().map(m => (
          <Message key={`${m.partition}-${m.offset}`} message={m}/>
        ))}
      </div>
    </React.Fragment>
  );
});
