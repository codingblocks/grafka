import React, {useState} from "react";
import gql from "graphql-tag";
import {
  Box,
  Card,
  LinearProgress
} from "@material-ui/core";
import { useSubscription } from "@apollo/react-hooks";
import { withApollo } from "@apollo/react-hoc";
import Message from "./Message";
import MessageSubscriptionForm from "./MessageSubscriptionForm";

// TODO configurable latch size, timeout, starting offset (first, last, last - x)
// TODO export? export to...?

export default withApollo(({ clusterId, topic, schema }) => {
  const defaultSubscriptionSettings = {
    latchSize: 100,
    latchTimeoutMs: 100,
    keyDeserializer: "org.apache.kafka.common.serialization.StringDeserializer",
    valueDeserializer: !!schema
      ? "io.confluent.kafka.serializers.KafkaAvroDeserializer"
      : "org.apache.kafka.common.serialization.StringDeserializer",
    maxDisplayCount: 20,
    startingOffset: 0
  };
  const [subscriptionSettings, setSubscriptionSettings] = useState(
    defaultSubscriptionSettings
  );

  const sub = useSubscription(subscription, {
    variables: {
      clusterId,
      topic,
      latchSize: subscriptionSettings.latchSize,
      latchTimeoutMs: subscriptionSettings.latchTimeoutMs,
      keyDeserializer: subscriptionSettings.keyDeserializer,
      valueDeserializer: subscriptionSettings.valueDeserializer,
      startingOffset: subscriptionSettings.startingOffset
    },
    shouldResubscribe: true,
    onSubscriptionData: () => {
      console.log(`onSubscriptionData`);
    }
  });

  const { messages } = sub.data || { messages: [] };

  // how the heck can you unsubscribe?

  return (
    <div style={{ flexGrow: 1 }}>
      <Box display="flex">
        {/* this should be a drawer? */}
        <Box style={{ width: 300, minWidth: 300 }}>
          <MessageSubscriptionForm
            topicName={topic}
            hasSchema={!!schema}
            subscriptionSettings={subscriptionSettings}
            onChange={setSubscriptionSettings}
          />
        </Box>
        <Box flexGrow={1} ml={4}>
          <div hidden={!sub.loading}>
            <em>Polling for messages...</em>
            <p>TODO:</p>
            <ul>
              <li>Highlight current offset, max offset in loading message</li>
              <li>Cache the users settings per topic (long term should live in db)</li>
              <li>Button to reset form to defaults</li>
            </ul>
          </div>
          <LinearProgress variant="query" hidden={!sub.loading} />
          <Card hidden={!sub.error} style={{ margin: 10, padding: 20 }}>
            <p>Error: {JSON.stringify(sub.error)}</p>
          </Card>
          <div hidden={sub.loading || sub.error}>
            {messages
              //.filter((i, index) => index < subscriptionSettings.maxDisplayCount)
              .reverse()
              .map(m => (
                <Message key={`${m.partition}-${m.offset}`} message={m} />
              ))}
          </div>
        </Box>
      </Box>
    </div>
  );
});


export const subscription = gql`
  subscription messages(
    $clusterId: ID!
    $topic: String!
    $latchSize: Int!
    $latchTimeoutMs: Int!
    $valueDeserializer: String!
    $startingOffset: Long!
  ) {
    messages(
      clusterId: $clusterId
      topic: $topic
      latchSize: $latchSize
      latchTimeoutMs: $latchTimeoutMs
      valueDeserializer: $valueDeserializer
      startingOffset: $startingOffset
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
