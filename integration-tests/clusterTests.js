const chai = require("chai");
const should = chai.should();
const { assert } = chai;
const url = process.env.GRAPHQL_ENDPOINT || `http://localhost:9000/`; // TODO
const request = require("supertest")(url);
const read = file => require('fs').readFileSync(`./resources/${file}`, `utf-8`);

describe("Grafka", () => {

  it("returns an empty array of clusters", emptyClusterDone => {
    request
      .post("/graphql")
      .send({
        query: read('basicClusterQuery.gql')
      })
    .expect(200)
    .end((err, res) => {
      // res will contain array with one user
      if (err) return done(err);
      const clusterData = res.body.data;
      clusterData.should.have.property("clusters");
      assert.equal(0, clusterData.clusters.length);
      emptyClusterDone();
    });
  });

  it("can save a new valid cluster", newClusterDone => {
    request
      .post("/graphql")
      .send({
        query: read(`newClusterMutation.gql`),
        variables: {
          name: "test",
          config: read('validClusterConfig.properties')
        }
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        const newClusterData = res.body.data;
        newClusterData.should.have.property("newCluster");

        assert.equal("test", newClusterData.newCluster.name);
        assert.equal(36, newClusterData.newCluster.clusterId.length);

        const {clusterId} = newClusterData.newCluster;

        request
          .post("/graphql")
          .send({
            query: read(`deleteClusterMutation.gql`),
            variables: {
              clusterId: clusterId
            }
          })
          .expect(200)
          .end((err, res) => {
            // res will contain array with one user
            if (err) return done(err);
            const data = res.body.data;
            console.log(data)
            data.should.have.property("deleteCluster");
            assert.equal(true, data.deleteCluster);
          });
        });
      newClusterDone();
  });
});