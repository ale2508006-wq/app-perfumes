const stripe = require("../config/stripe");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

async function createPaymentIntent(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, userId });

  if (!order) throw new Error("Pedido no encontrado");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: "mxn",
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: order._id.toString(),
      userId
    }
  });

  order.paymentIntentId = paymentIntent.id;
  await order.save();

  const payment = await Payment.create({
    orderId: order._id,
    userId,
    stripePaymentIntentId: paymentIntent.id,
    amount: order.total,
    status: "pending"
  });

  return {
    clientSecret: paymentIntent.client_secret
  };
}

module.exports = {
  createPaymentIntent
};