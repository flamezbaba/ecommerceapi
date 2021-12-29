process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
const User = require("../models/Users");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);
let userLog;
describe("Auth", () => {
  before((done) => {
    // delete all users
    User.deleteMany({}, (err) => {
      done();
    });

    userLog = {
      username: "test1",
      email: "test1@gmail.com",
      password: "test1",
    };
  });

  describe("can /register", () => {
    it("can create account", (done) => {
      chai
        .request(server)
        .post("/api/auth/register")
        .send(userLog)
        .end((err, res) => {
          // console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status");
          res.body.should.have.property("data");
          done();
        });
    });
  });

  describe("can /login", () => {
    it("can login", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send(userLog)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status");
          res.body.should.have.property("data");
          res.body.data.should.have.property("accessToken");
          done();
        });
    });
  });
});
