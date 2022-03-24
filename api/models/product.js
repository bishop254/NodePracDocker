const mongoose = require("mongoose");

const product_schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: false },
});

module.exports = mongoose.model("Product", product_schema);
