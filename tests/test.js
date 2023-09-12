const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");

chai.use(chaiHttp);
chai.should();

describe("People", () => {
  after(() => {
    server.close();
  });
  describe("post /api/v1/people", () => {
    it("should not create a people entry without a name", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ age: 10 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({ error: "Please enter a name." });
          done();
        });
    });
    it("should create a people entry with valid input", (done) => {
      // my code:
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ name: "John Doe", age: 20 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.contain({ msg: "A person record was added" });
          this.lastIndex = res.body.index;
          done();
        });
    });
  });
  describe("get /api/v1/people", () => {
    it(`should return an array of person entries of length ${this.lastIndex}`, (done) => {
      // my code:
      chai
        .request(app)
        .get("/api/v1/people")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.length(this.lastIndex);
          done();
        });
    });
  });
  describe("get /apl/v1/people/:id", () => {
    it("should return the entry corresponding to the last person added.", (done) => {
      // my code:
      chai
        .request(app)
        .get(`/api/v1/people/${this.lastIndex}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.name.should.be.equal("John Doe");
          done();
        });
    });
    it("should return an error if the index is >= the length of the array", (done) => {
      // my code:
      chai
        .request(app)
        .get(`/api/v1/people/${this.lastIndex + 1}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.contain({
            error: "No people with the entered ID.",
          });
          done();
        });
    });
  });
});
