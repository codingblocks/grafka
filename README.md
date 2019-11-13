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
* Querying (~65% done)
   * Clusters
   * Topics
   * Consumer Groups
   * Schema
   * Messages
   * Connect
   * KSQL
* Mutating (~10% done)
   * Cluster Config
   * Topics
   * Consumer Group Resetting
   * Connectors
   * Schema
* UI (~5% done)
   * Near real-time updates
   * Security
   * Easy export/search topics

## Major components
* Kafka (only tested with 2.3)
* Spring Boot
* GraphQL
* GraphQL UI (GraphiQL or Altair)
* Postgres

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

## Testing

There is a docker-compose file setup for running integration tests. You can run it like...
```shell script
docker-compose -f docker-compose-tests.yml up --build --abort-on-container-exit
```

## Troubleshooting:

Q: Getting an error about the port in use?

A: Make sure that everything is stopped before re-running!

Q: Web app stuck in a bad spot?

A: Try running this: `localStorage.clear()`
