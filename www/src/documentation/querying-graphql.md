## Sample queries

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

*You can also create topics*
```graphql
mutation {
  newTopicByPartitionAndReplicationFactor(clusterId: "paste.your.clusterId.here", topicName: "test-topic", partitionCount: 1, replicationFactor: 1)
}
```

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
}
```


*Testing subscriptions: (pass null to get all results)*
Note: this isn't working very well...
```graphql
subscription subscriptionNameHere {
  messages(
    clusterId: "paste.your.clusterId.here"
    topic: "paste.your.topic.name.here"
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