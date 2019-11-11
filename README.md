# Grafka: GraphQL interface for Apache Kafka

## Step 1: Get things running

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

## Step 2: GraphQL UI
Open up the site on http://localhost:3000, you can find links to "Query UI" and sample queries there. (Also on [github](https://github.com/codingblocks/grafka/blob/master/www/src/documentation/querying-graphql.md))

## Priorities:
* Querying (~90% done)
   * Clusters
   * Topics
   * Consumer Groups
   * Schema
   * Connect
   * KSQL
   * Messages
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
