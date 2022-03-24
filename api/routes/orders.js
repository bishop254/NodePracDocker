const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const OrdersController = require('../controller/orders')

//All requests have a middleware (checkAuth) that verifies if a valid token is present in the headers

// GET request to fetch all orders 
router.get("/", checkAuth, OrdersController.get_all_orders);

// POST request to fetch all orders 
router.post("/", checkAuth, OrdersController.post_order);

// GET request to fetch all orders 
router.get("/:id", checkAuth, OrdersController.get_specific_order);

// DELETE request to fetch all orders 
router.delete("/:id", checkAuth, OrdersController.del_specific_order);

// exports this router making orders.js available to other files
module.exports = router; 
