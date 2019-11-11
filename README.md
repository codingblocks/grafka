# Grafka: GraphQL interface for Apache Kafka

Grafka provides a GraphQL interface for [Apache Kafka](https://github.com/apache/kafka) administration and a simple UI for interacting the information.

The UI will remain simple, as the main value of this project is providing the GraphQL interface so you can integrate with your own projects.

## Getting Started

### Step 1: Get things running

This project currently relies on postgres for storing configuration data. There is a docker-compose file you can run to get started:
```shell script
docker-compose up -d
```

Now you can run the UI:
```shell script
cd www
npm install
npm start
```

Finally run the app in IntelliJ (or whatever)

### Step 2: User interfaces

Grafka comes with a couple different ways to access your information.

*Grafka UI*
Open up the site on http://localhost:3000, you can find links to "Query UI" and sample queries there. (Also on [github](https://github.com/codingblocks/grafka/blob/master/www/src/documentation/querying-graphql.md))

*Altair*
Open up http://localhost:9000/altair to use the [Altair UI](https://altair.sirmuel.design/) for GraphQL.

*GraphiQL*
Open up http://localhost:9000/graphiql to use the [GraphiQL](https://github.com/graphql/graphiql) for GraphQL.

### Step 3: GraphQL API

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

## Troubleshooting:

Q: Getting an error about the port in use?

A: Make sure that everything is stopped before re-running!

Q: Web app stuck in a bad spot?

A: Try running this: `localStorage.clear()`
