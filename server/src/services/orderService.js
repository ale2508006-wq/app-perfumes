const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

async function createOrder(userId, shippingAddress = {}, paymentIntentId = "") {
  const cart = await Cart.findOne({ userId });

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Producto no encontrado: ${item.name}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${item.name}`);
    }
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    product.stock -= item.quantity;
    await product.save();
  }

  const subtotal = Number(cart.subtotal || 0);
  const shippingCost = subtotal >= 1500 ? 0 : 150;
  const total = subtotal + shippingCost;

  const order = await Order.create({
    userId,
    items: cart.items,
    subtotal,
    shippingCost,
    total,
    status: "pending",
    shippingAddress,
    paymentIntentId,
  });

  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;
  await cart.save();

  return order;
}

async function getOrders(userId) {
  return Order.find({ userId }).sort({ createdAt: -1 });
}

async function getOrderById(userId, orderId) {
  return Order.findOne({ _id: orderId, userId });
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};