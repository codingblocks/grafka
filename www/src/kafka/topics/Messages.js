import React from "react";
import gql from "graphql-tag";
import { useSubscription } from "@apollo/react-hooks";
import LinearProgress from "@material-ui/core/LinearProgress";
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
      <p hidden={!sub.loading}>This can take a while to start...</p>
      <p hidden={!sub.error}>Error: {JSON.stringify(sub.error)}</p>
      <div hidden={sub.loading || sub.error}>
        {messages.filter((i, index) => (index < maxDisplaySize)).reverse().map(m => (
          <Message key={`${m.partition}-${m.offset}`} message={m}/>
        ))}
      </div>
    </React.Fragment>
  );
});
