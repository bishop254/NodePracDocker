const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/checkAuth");
const ProductController = require('../controller/products')

const storage = multer.memoryStorage(); // Stores our image in a buffer.

// Checks if the image is a jpeg or png file.
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Parameters provided by multer which will be applied to the uploaded image.
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const router = express.Router();


// GET request to fetch all products.
router.get("/", ProductController.get_all_products);

// POST request to create a new product.
router.post("/", upload.single("img"), checkAuth,  ProductController.post_product);

// GET request to fetch a specific.
router.get("/:id", ProductController.get_specific_product);

// PATCH request to update an existing product.
router.patch("/:id", checkAuth, ProductController.patch_specific_product);

// DELETE request to delete a specific product.
router.delete("/:id", checkAuth, ProductController.delete_specific_product);

module.exports = router;
