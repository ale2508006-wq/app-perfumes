const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "No hay productos para procesar el pago",
      });
    }

    const amount = items.reduce((acc, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);
      return acc + price * quantity;
    }, 0);

    if (amount <= 0) {
      return res.status(400).json({
        message: "El monto total es inválido",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "mxn",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creando pago:", error);
    return res.status(500).json({
      message: "Error creando pago",
    });
  }
});

module.exports = router;