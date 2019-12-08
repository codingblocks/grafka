## Cluster queries

*Do you have any cluster configs saved?*
```graphql
{
  clusters {
    clusterId
    name
    config
  }
}
```

*Now let's save a configuration!*

```graphql
mutation {
  newCluster(name: "name",config: "paste.your.config=here") {
    clusterId
    name
    config
  }
}
```

*Let's try updating the configuration now*

```graphql
mutation {
   updateCluster(clusterId: "paste.your.clusterId.here", name: "Memorable name", config: "paste.your.config=here") {
       clusterId, name
   }
}
```

*We can also delete them:*
```graphql
mutation {
   deleteCluster(clusterId: "paste.your.clusterId.here")
}
```

## Topics

*You can also create topics*
```graphql
mutation {
  newTopicByPartitionAndReplicationFactor(clusterId: "paste.your.clusterId.here", topicName: "test-topic", partitionCount: 1, replicationFactor: 1)
}
```

## Kafka Connect

*Creating a new Connect cluster:*
```graphql
mutation {
  newConnect(name: "Test", config:"url:http://localhost:8083") {
    connectId
    name
    config
  }
}
```

*Adding or connector, this won't actually work, but it's a valid config so it will get saved:*
```graphql
mutation {
  saveConnector(connectId: "e12a0c4e-f0da-41cd-a7d4-d82859580bac", name:"test3", connectorConfig:
  "{\"name\":\"local-file-source2\",\"config\":{\"connector.class\":\"FileStreamSource\",\"topic\":\"connect-test\",\"file\":\"test.txt\"}}"
  )
}
```

*Querying all connectors*

```graphql
{
  connect {
    name
    config
    connectId
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
          workerId
        }
      }
    }
  }
}
```


## Lots of information!

*Let's take a look at all the information we have now (note: this is slow!)*
```graphql
{
  clusters {
    clusterId
    name
    config
    description {
      controller {
        host
        id
        idString
        port
        rack
      }
      nodes {
        host
        id
        idString
        port
        rack
      }
      authorizedOperations {
        code
        unknown
      }
    }
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
  connect {
    name
    config
    connectId
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
          workerId
        }
      }
    }
  }
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

Note: if you're working in a graphical tool, the subscription url is `ws:localhost:9000/subscriptions`
