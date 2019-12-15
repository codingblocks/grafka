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