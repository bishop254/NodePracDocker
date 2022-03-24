const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.get_all_orders = (req, res, next) => {
  // Search for orders in the database
  Order.find()
    .select("_id product quantity")
    .populate("product", "name price")
    .exec()
    .then((data) => {
      const response = {
        count: data.length,
        orders: data.map((data) => {
          return {
            order_id: data._id,
            product: data.product,
            quantity: data.quantity,
            requests: [
              {
                type: "GET",
                info: "View specific orders",
                url: "http://localhost:3000/orders/" + data._id,
              },
              {
                type: "GET",
                info: "View specific product",
                url: "http://localhost:3000/products/" + data.product,
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

exports.post_order = (req, res, next) => {
  // Find a product using the Id criteria.
  // Creating an order requires an existing product. Fails if no product is found with that ID.
  Product.findById(req.body.product)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: "No product found",
        });
      }

      // Creates an order if product is available in our database.
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((data) => {
      res.status(201).json({
        message: "Order created",
        order: {
          id: data._id,
          quantity: data.quantity,
          requests: [
            {
              type: "GET",
              info: `Obtain details of this order`,
              url: "http://localhost:3000/orders/" + data.id,
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
      res.status(500).json({
        error: err,
        message: "Product not found",
      });
    });
};

exports.get_specific_order = (req, res, next) => {
  const id = req.params.id;
  
  // Find an order using the ID criteria.
  Order.findById(id)
    .populate("product") // Fetches the details the product the order is connected to.
    .exec()
    .then((data) => {
      if (data) {
        res.status(200).json({
          order_id: data._id,
          product: data.product,
          quantity: data.quantity,
          requests: [
            {
              type: "GET",
              info: `Obtain details of all orders`,
              url: "http://localhost:3000/orders/",
            },
          ],
        });
      } else {
        res.status(404).json({
          message: "No order found",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
        message: "Order not found",
      });
    });
};

exports.del_specific_order = (req, res, next) => {
  const id = req.params.id;

  // Removes an order based on ID
  Order.deleteOne({ _id: id })
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Order deleted",
        requests: [
          {
            type: "GET",
            info: "Get all orders",
            url: "http://localhost:3000/orders",
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
