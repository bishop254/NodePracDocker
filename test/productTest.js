const assert = require("assert");
const users = require("../api/routes/users");
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

describe("Get All Products", () => {
  it("Should display all products in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/products")
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        done();
      });
  });
});

// Has various unit tests.
// Begin by obtaining a JWT Token.
// Unit test 1 - Display all products in the database.
// Unit test 2 - Create a new product in the database.
// Unit test 3 - Display a specific product in the database.
// Unit test 4 - Updates a specific product in the database.
// Unit test 5 - Deletes a specific product in the database.
describe("Post a new product and Update product details", (done) => {
  let jsonToken;
  let prod_id;

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
        done();
      });
  });

  it("Should display all products in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/products")
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        done();
      });
  });

  it("Should create products in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/products")
      .set("Authorization", "Bearer " + jsonToken)
      .send({
        name: "Beef Eater",
        price: "1650",
        img: "./IMG_0004new.JPG",
      })
      .end((err, resp) => {
        prod_id = resp.body.created_product.id;
        expect(resp).to.have.status(201);
        expect(resp.body).to.have.property("message");
        done();
      });
  });

  it("Should display a specific product in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/products/" + prod_id)
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        done();
      });
  });
  
  it("Should update a product in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .patch("/products/" + prod_id)
      .set("Authorization", "Bearer " + jsonToken)
      .send([
        {
          propName: "name",
          value: "Beef Eater 750ml",
        },
      ])
      .end((err, resp) => {
        // console.log(resp);
        expect(resp).to.have.status(200);
        expect(resp.body).to.have.property("message");
        done();
      });
  });

  it("Should remove a product in the database", (done) => {
    chai
      .request("http://localhost:3000")
      .delete("/products/" + prod_id)
      .set("Authorization", "Bearer " + jsonToken)
      .end((err, resp) => {
        expect(resp).to.have.status(200);
        expect(resp.body).to.have.property("message");
        done();
      });
  });
});


// Has various unit tests.
// Unit test 1 - Checks if user passed a wrong url.
// Unit test 2 - Checks if user tries to create a product without a JWT  Authorization Token.
// Unit test 3 - Checks if user tries to fetch a specific product that doesn't exist.
// Unit test 4 - Checks if user tries to update a specific product without a JWT  Authorization Token.
// Unit test 4 - Checks if user tries to delete a product without a JWT  Authorization Token.
describe("Bad cases of /products url", (done) => {
  let prod_id;

  it("Should not display all products in the database if url is incorrect", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/product")
      .end((err, resp) => {
        expect(resp).to.have.status(404);
        done();
      });
  });

  it("Should not create a product in the database if user is authorized", (done) => {
    chai
      .request("http://localhost:3000")
      .post("/products")
      .send({
        name: "Beef Eater",
        price: "1650",
        img: "./IMG_0004new.JPG",
      })
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });

  it("Should not display a non existing product", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/products/" + prod_id + '123')
      .end((err, resp) => {
        expect(resp).to.have.status(404);
        done();
      });
  });
  
  it("Should not update a product in the database if user is unauthorized", (done) => {
    chai
      .request("http://localhost:3000")
      .patch("/products/" + prod_id)
      .send([
        {
          propName: "name",
          value: "Beef Eater 750ml",
        },
      ])
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });

  it("Should not remove a product in the database if user is unauthorized", (done) => {
    chai
      .request("http://localhost:3000")
      .delete("/products/" + prod_id)
      .end((err, resp) => {
        expect(resp).to.have.status(401);
        done();
      });
  });
});
