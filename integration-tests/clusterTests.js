const chai = require("chai");
const should = chai.should();
const { assert } = chai;
const url = process.env.GRAPHQL_ENDPOINT || `http://localhost:9000/`; // TODO

const request = require("supertest")(url);

describe("Grafka with no saved clusters", () => {
  it("returns an empty array of clusters", done => {
    request
      .post("/graphql")
      .send({
        query: `
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
          }
        `
      })
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
});
