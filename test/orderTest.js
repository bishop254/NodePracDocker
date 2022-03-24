const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp); // Allows chai to make requests.

// Log any uncaught errors to the console. 
const onUncaught = (err) => {
  console.log(err);
  process.exit(1);
};
process.on("unhandledRejection", onUncaught);

// Has various unit tests.
// Begin by obtaining a JWT Token and a Product ID.
// Unit test 1 - Get all orders in the database.
// Unit test 2 - Create an orders in the database.
// Unit test 3 - Get a specifc order in the database.
// Unit test 4 - Delete a specific order in the database.
describe("Dealing with orders", (done) => {
  let jsonToken;
  let order_id;
  let prod_id;
  let textJSON;

  beforeEach((done) => {
    chai
      .request("http://localhost:3000")
      .post("/users/login")
      .send({
        email: "admin@test.co",
        password: "admin",
      })
      .end((err, resp) => {
        expect(resp.body).to.have.property("token");
        jsonToken = resp.body.token;

        chai
          .request("http://localhost:3000")
          .get("/products")
          .end((err, resp1) => {
            textJSON = JSON.parse(resp1.text);
            prod_id = textJSON.products[0].id;
          });
        done();
      });
  });

  it("Should get all orders in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/orders")
      .set("Authorization", "Bearer " + jsonToken)
      .end((err, resp) => {
        textJSON = JSON.parse(resp.text);
        order_id = textJSON.orders[0].order_id;
        expect(resp).to.have.status(200);
        done();
      });
  });

  it("Should create an order in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/orders/")
      .set("Authorization", "Bearer " + jsonToken)
      .send({
        product: prod_id,
        quantity: "7",
      })
      .end((err, resp) => {
        expect(resp).to.have.status(201);
        done();
      });
  });

  it("Should get a specific order in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/orders/" + order_id)
      .set("Authorization", "Bearer " + jsonToken)
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        done();
      });
  });

  it("Should delete a specific order in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .delete("/orders/" + order_id)
      .set("Authorization", "Bearer " + jsonToken)
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        done();
      });
  });
});


// Has various unit tests to check if user is authorized.
// Unit test 1 - Should pass if user tries to fetch orders without a JWT  Authorization Token.
// Unit test 2 - Should pass if user tries to create an order without a JWT  Authorization Token.
// Unit test 3 - Should pass if user tries to fetch a specific order without a JWT  Authorization Token.
// Unit test 4 - Should pass if user tries to delete an order without a JWT  Authorization Token.
describe("Dealing with orders bad cases", (done) => {
  let order_id;
  let prod_id;

  it("Should not get all orders if user is unauthorized", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/orders")
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });

  it("Should not create an order if user is unauthorized", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/orders/")
      .send({
        product: prod_id,
        quantity: "7",
      })
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });

  it("Should not get a specific order if user is unauthorized", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/orders/" + order_id)
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });

  it("Should not delete a specific order if user is unauthorized", (done) => {
    chai
      .request("http://localhost:3000")
      .delete("/orders/" + order_id)
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });
});
