const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String, default: "" },
    stock:       { type: Number, default: 0 },
    category:    { type: String, default: "عام" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);