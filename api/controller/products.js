const Product = require("../models/product");
const mongoose = require("mongoose");
const sharp = require("sharp");

exports.get_all_products = (req, res, next) => {
  // Locates all products in the database.
  Product.find()
    .select("name price _id img")
    .exec()
    .then((data) => {
      const response = {
        count: data.length,
        products: data.map((data) => {
          // Map through each product displaying its detains and some navigation urls.
          return {
            name: data.name,
            price: data.price,
            id: data._id,
            img: data.img,
            requests: [
              {
                type: "GET",
                info: `Obtain details of ${data.name}`,
                url: "http://localhost:3000/products/" + data.id,
              },
            ],
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

// Async allows for execution to continue if the handling the uploaded image takes too long.
exports.post_product = async (req, res, next) => {
  // Checks to seee if image is uploaded.
  // Then use sharp to resize the image and give it a new name.
  if (req.file) {
    await sharp(req.file ? req.file.buffer : null)
      .resize({ width: 50, height: 50 })
      .jpeg({ quality: 85 })
      .toFile("uploads/" + req.file.originalname);
  }

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    img: "uploads/" + (req.file ? req.file.originalname : "null_img"),
  });
  product
    .save()
    .then((data) => {
      res.status(201).json({
        message: "Product added",
        created_product: {
          name: data.name,
          price: data.price,
          id: data._id,
          img: data.img,
          requests: [
            {
              type: "GET",
              info: `Obtain details of ${data.name}`,
              url: "http://localhost:3000/products/" + data.id,
            },
            {
              type: "GET",
              info: `Obtain details of all products`,
              url: "http://localhost:3000/products/",
            },
          ],
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_specific_product = (req, res, next) => {
  const id = req.params.id;
  // Locates a specific product on our database based on ID.
  Product.findById(id)
    .exec()
    .then((data) => {
      console.log(data);

      // If the product is available then display its details.
      if (data) {
        res.status(200).json({
          products: {
            name: data.name,
            price: data.price,
            id: data._id,
            img: data.img,
            requests: [
              {
                type: "GET",
                info: `Obtain details of all products`,
                url: "http://localhost:3000/products/",
              },
            ],
          },
        });
      } else {
        res.status(404).json({
          message: "No product fount with that ID",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Invalid ObjectId",
      });
    });
};

exports.patch_specific_product = (req, res, next) => {
  const id = req.params.id;
  const updateOps = {}; // Will allow us to edit one or many parameters of a product.
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  // Locates a product based on ID.
  // updateOps allows us to define a propName and value. Usage -> [{propName: 'name', value: 'Hennesy'}]
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((data) => {
      res.status(200).json({
        message: `Product with id ${data._id} has been updated`,
        requests: [
          {
            type: "GET",
            info: `Obtain details of ${data._id}`,
            url: "http://localhost:3000/products/" + data.id,
          },
          {
            type: "GET",
            info: `Obtain details of all products`,
            url: "http://localhost:3000/products/",
          },
        ],
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_specific_product = (req, res, next) => {
  const id = req.params.id;
  // Locates a product based on Id and removes it.
  Product.deleteOne({ _id: id })
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Product deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
