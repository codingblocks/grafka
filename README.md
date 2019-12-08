# Grafka: GraphQL interface for Apache Kafka

Grafka provides a GraphQL interface for [Apache Kafka](https://github.com/apache/kafka) administration and a simple UI for interacting the information.

The UI will remain simple, as the main value of this project is providing the GraphQL interface so you can integrate with your own projects.

## Getting Started

The easiest way to get up and running is to simply start up the provided docker-compose file. This will start up the site at http://localhost:3000:

```shell script
docker-compose up -d
```

### User interfaces

Grafka comes with a couple different ways to access your information.

*Grafka UI*
Open up the site on http://localhost:3000, you can find links to "Query UI" and sample queries there. (Also on [github](https://github.com/codingblocks/grafka/blob/master/www/src/documentation/querying-graphql.md))

*Altair*
Open up http://localhost:9000/altair to use the [Altair UI](https://altair.sirmuel.design/) for GraphQL.

*GraphiQL*
Open up http://localhost:9000/graphiql to use the [GraphiQL](https://github.com/graphql/graphiql) for GraphQL.

### GraphQL API

The user interfaces give you some insight into your cluster, but ultimately the true value of Grafka is making it easier for you to integrate Kafka administration tasks into your own solutions.

The graphql endpoint runs at http://localhost:9000/graphql by default.

## Priorities:

* Querying
   * ~~Clusters~~
   * ~~Topics~~
   * ~~Consumer Groups~~
   * ~~Schema~~
   * ~~Messages~~
   * ~~Connect~~
* Mutating
   * ~~Cluster Config~~
   * ~~Topics~~
   * ~~Connectors~~
   * Consumer Group Resetting
   * Schema
* UI (~5% done)
   * Near real-time updates
   * Security
   * Easy export/search topics
   * Action logging, auditing
* Miscellaenous 0%
   * KSQL

## Major components

* Kafka (only tested with 2.3)
* Spring Boot
* GraphQL
* GraphQL UI (GraphiQL or Altair)
* Postgres
* Schema Registry, Kafka Connect, KSQL (planned)

## Working locally:

If you're trying to work on the site, then I recommend starting up docker-compose like above, but then stopping the services you want to work on. For example, this will shut down the website and the spring component so you can run them locally instead.

```shell script
docker-compose up -d
docker-compose stop www
docker-compose stop api
```

Now you can run the UI independently:

```shell script
cd www
npm install
npm start
```

And you can open up the "grafka" subfolder in an editor like IntelliJ or run something like...

```shell script
cd grafka
gradle build
```

Running docker-compose up will start up a test Kafka environment for you as well. Here is a sample configuration that will work with it. Warning: This config only works if you are running the java app in something like your IDE. If you are running the graphql endpoing in docker, then you will need to change the bootstrap.servers to kafka1:9092

```properties
application.id=grafka
group.id=grafka
bootstrap.servers=localhost:29092

schema.registry.url=http://localhost:8081

key.serializer=org.apache.kafka.common.serialization.StringSerializer
value.serializer=io.confluent.kafka.serializers.KafkaAvroSerializer

key.deserializer=org.apache.kafka.common.serialization.StringDeserializer
value.deserializer=io.confluent.kafka.serializers.KafkaAvroDeserializer

avro.specific.reader=true
```

Note: The schema registry configuration is currently lumped in with the cluster configuration (there's a ticket for [that](https://github.com/codingblocks/grafka/issues/15)), however you can ditch it with a config like:
```properties
application.id=grafka
group.id=grafka
bootstrap.servers=localhost:29092

key.serializer=org.apache.kafka.common.serialization.StringSerializer
value.serializer=org.apache.kafka.common.serialization.StringSerializer

key.deserializer=org.apache.kafka.common.serialization.StringDeserializer
value.deserializer=org.apache.kafka.common.serialization.StringDeserializer
```

## Testing

There is a docker-compose file setup for running integration tests. You can run it like...
```shell script
docker-compose -f docker-compose-tests.yml up --build --abort-on-container-exit -V
```

## Troubleshooting:

Q: Getting an error about the port in use?

A: Make sure that everything is stopped before re-running!

Q: Web app stuck in a bad spot?

A: Try running this: `localStorage.clear()`

Q: Unable to connect to bootstrap servers?

A: Are you running the graphql endpoint in docker? Then the bootstrap.servers should be kafka1:9092
