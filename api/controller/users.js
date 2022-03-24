const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // used for creating a token.
const bcrypt = require("bcrypt"); // Used for hashing our password.

exports.signup = (req, res, next) => {
  // Checks to see if the email in the request body already exists in the database.
  User.find({ email: req.body.email })
    .exec()
    .then((data) => {
      if (data.length >= 1) {
        res.status(409).json({
          message: "User already exists",
        });
      } else {
        // Create a password has if the email is unique.
        bcrypt.hash(req.body.password, 11, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash, // Hash is saved in the database.
            });

            user
              .save()
              .then((data) => {
                console.log(data);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                  message: "Sign-up failed",
                });
              });
          }
        });
      }
    });
};

exports.login = (req, res, next) => {
  // Locates a user based on email passed in the request body
  User.findOne({ email: req.body.email })
    .exec()
    .then((data) => {
      if (data.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      // Check if the hash of the input password is somewhat similar to the one stored in the database.
      bcrypt.compare(req.body.password, data.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          // Creates a token if authentication succeded.
          const token = jwt.sign(
            {
              email: data.email,
              userId: data._id,
            },
            "process.env.JWT_KEY", // Our secret key.
            {
              expiresIn: "3h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            userId: data._id,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Auth failed",
      });
    });
};

exports.delete_user = (req, res, next) => {
  const id = req.params.id;
  // Locates a user based on ID and deletes that user.
  User.deleteOne({ _id: id })
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Deletion failed",
      });
    });
};
