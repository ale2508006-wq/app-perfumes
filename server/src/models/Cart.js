const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        name: String,
        brand: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
        imageUrl: String,
        sizeMl: Number,
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
