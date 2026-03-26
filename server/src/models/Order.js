const mongoose = require("mongoose");

const STATUS_MAP = {
  pendiente: "pending",
  pending: "pending",
  pagado: "paid",
  paid: "paid",
  enviado: "shipped",
  shipped: "shipped",
  entregado: "delivered",
  delivered: "delivered",
  cancelado: "cancelled",
  cancelled: "cancelled",
};

function normalizeStatus(status) {
  if (!status) return "pending";

  const normalized = STATUS_MAP[String(status).trim().toLowerCase()];
  return normalized || String(status).trim().toLowerCase();
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        brand: String,
        price: Number,
        quantity: Number,
        imageUrl: String,
        sizeMl: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
      set: normalizeStatus,
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentIntentId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

orderSchema.pre("validate", function (next) {
  this.status = normalizeStatus(this.status);
  next();
});

module.exports = mongoose.model("Order", orderSchema);