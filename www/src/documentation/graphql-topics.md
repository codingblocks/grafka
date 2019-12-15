
## Topics

*Topics are generally fetched in the context of a cluster, and there is a variety of information that can be returned*
```graphql
{
  clusters {
    topicListings {
      name
      internal
      configs {
        config {
          default
          readOnly
          sensitive
          name
          source
          synonyms {
            name
            value
            source
          }
          value
        }
        offsets {
          offsetCount
          lifetimeOffsetCount
          partitionCount
          maxOffset
          minOffset
          partitionOffsets {
            partition
            beginningOffset
            endOffset
            offsetCount
          }
        }
        resource {
          name
          type
          default
        }
      }
      description {
        name
        internal
        partitions {
          partition
          leader {
            id
            idString
            host
            port
            rack
          }
          replicas {
            id
            idString
            host
            port
            rack
          }
          isr {
            id
            idString    
            host
            port
            rack
          }
        }
      }
      consumerGroups {
        groupId
        simpleConsumerGroup
        offsets {
          partition
          topicName
          leaderEpoch
          metadata
          offset
        }
      }
      schema {
        subject
        metadata {
          id
          version
          schema
        }
        compatibilityMode
      }
    }
  }
}
```

*You can also create topics*
```graphql
mutation {
  newTopicByPartitionAndReplicationFactor(clusterId: "paste.your.clusterId.here", topicName: "test-topic", partitionCount: 1, replicationFactor: 1)
}
```

## Subscriptions

*Testing subscriptions: (pass null to get all results, check out formal documentation for all objects)*

```graphql
subscription subscriptionNameHere {
  messages(
    clusterId: "paste.your.clusterId.here"
    topic: "paste.your.topic.name.here"
    valueDeserializer: "org.apache.kafka.common.serialization.StringDeserializer"
    latchSize: 200
    latchTimeoutMs: 200
  ) {
    key,
    value,
    partition,
    offset,
    timestampType,
    timestamp,
    leaderEpoch
  }
}
```
