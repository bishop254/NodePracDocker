const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const UserController = require('../controller/users')

// POST request to create a new user.
router.post("/signup", UserController.signup);

// POST request to login an existing user.
router.post("/login", UserController.login);

// DELETE request to delete a user.
// Requires an Authorization header to allow the request to be handled.
router.delete("/:id", checkAuth, UserController.delete_user);

module.exports = router;
