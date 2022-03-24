const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { randomInt } = require("crypto");
const expect = chai.expect;

chai.use(chaiHttp);

const onUncaught = (err) => {
  console.log(err);
  process.exit(1);
};
process.on("unhandledRejection", onUncaught);

// Has various unit tests.
// Unit test 1 - Should pass if a new user is created.
// Unit test 2 - Should reject a user if he/she tries to create an account with an existing email.
// Unit test 3 - Should pass if user logs in succesfully.
// Unit test 4 - Should pass if user is deleted succesfully.
describe("Dealing with Users", () => {
  let user_id;
  let jsonToken;

  const randNum = randomInt(99);
  const userSt = {
    email: "user" + randNum.toString() + "@user.com",
    password: "user123",
  };

  it("Should create a new user ", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/users/signup")
      .send(userSt)
      .end((err, resp) => {
        expect(resp).to.have.status(201);
        done();
      });
  });

  it("Should reject a user if email already exists", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/users/signup")
      .send(userSt)
      .end((err, resp) => {
        expect(resp).to.have.status(409);
        done();
      });
  });

  it("Should login a user", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/users/login")
      .send(userSt)
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        jsonToken = resp.body.token;
        user_id = resp.body.userId;
        done();
      });
  });

  it("Should delete a user", (done) => {
    chai
      .request("http://localhost:3000")
      .delete("/users/" + user_id)
      .set("Authorization", "Bearer " + jsonToken)
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        done();
      });
  });
});

// Has various unit tests that deal with authorization and bad input.
// Unit test 1 - Should pass if user passes an incorrect email/password.
// Unit test 2 - Should pass if a non existent user tries to log in.
// Unit test 3 - Should pass if user tries to delete a user account without a JWT  Authorization Token.
describe("Dealing with Users with bad cases", () => {
  const userSt = {
    email: "user_user.com",
    password: "user123",
  };

  it("Should not create a new user if email/password is invalid", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/users/signup")
      .send(userSt)
      .end((err, resp) => {
        expect(resp).to.have.status(500);
        done();
      });
  });

  it("Should not login an invalid user", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/users/login")
      .send(userSt)
      .end((err, resp) => {
        expect(resp).to.have.status(500);
        jsonToken = resp.body.token;
        user_id = resp.body.userId
        done();
      });
  });

  it("Should not delete a user if user is unauthorized", (done) => {
    chai
      .request("http://localhost:3000")
      .delete("/users/" + user_id)
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });
});
