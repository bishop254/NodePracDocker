const express = require("express"); // Import a library
const bodyParser = require("body-parser");
const product_routes = require("./api/routes/products");
const orders_routes = require("./api/routes/orders");
const users_routes = require("./api/routes/users");
const mongoose = require("mongoose");
const ServerApiVersion = require("mongodb");

const port = process.env.PORT || 3000;
const app = express();

const uri =
  "mongodb+srv://admin:admin@nodeapi.ek5zs.mongodb.net/Product?retryWrites=true&w=majority";

  // Connect to Mongoose Atlas database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use("/uploads", express.static("uploads")); // Allows our uploaded images to be publicly available.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.use("/users", users_routes);
app.use("/products", product_routes);
app.use("/orders", orders_routes);

// This route is hit if an invalid url is input.
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
  res.end();
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
}); //Lets the server listen on the port

