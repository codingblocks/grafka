const chai = require("chai");
const should = chai.should();
const { assert } = chai;
const url = process.env.GRAPHQL_ENDPOINT || `http://localhost:9000/`; // TODO

const request = require("supertest")(url);

const validLocalConfig = `application.id=grafka
group.id=grafka
bootstrap.servers=kafka1:9092

schema.registry.url=http://schemaregistry:8081

key.serializer=org.apache.kafka.common.serialization.StringSerializer
value.serializer=io.confluent.kafka.serializers.KafkaAvroSerializer

key.deserializer=org.apache.kafka.common.serialization.StringDeserializer
value.deserializer=io.confluent.kafka.serializers.KafkaAvroDeserializer

avro.specific.reader=true`;

const basicClusterQuery = `
{
  clusters {
    clusterId
    config
    description {
      nodes {
        id
        host
        port
        rack
      }
      controller {
        id
        host
        port
        rack
      }
      authorizedOperations {
        code
        unknown
      }
    }
  }
}`;

const newClusterMutation = `mutation($name:String!, $config:String!) {
  newCluster(name: $name, config: $config) {
    clusterId
    name
    config
  }
}`;

// TODO Got to get rid of this, how to better check that kafka is ready?
require('system-sleep')(60 * 1000);

describe("Grafka with no saved clusters", () => {
  it("returns an empty array of clusters", done => {
    request
      .post("/graphql")
      .send({
        query: basicClusterQuery
      })
      .timeout(2 * 60 * 1000)
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        const data = res.body.data;
        data.should.have.property("clusters");
        assert.equal(0, data.clusters.length);
        //res.body.data.should.have.property("clusters");
        done();
      });
  });

  it("saves a new valid cluster", done => {
    request
        .post("/graphql")
        .send({
          query: newClusterMutation,
          variables: {
            name: "test",
            config: validLocalConfig
          }
        })
        .timeout(2 * 60 * 1000)
        .expect(200)
        .end((err, res) => {
          // res will contain array with one user
          if (err) return done(err);
          const data = res.body.data;
          console.log(data)
          data.should.have.property("newCluster");

          assert.equal("test", data.newCluster.name);
          assert.equal(36, data.newCluster.clusterId.length);
          //res.body.data.should.have.property("clusters");
          done();
        });
  });
});