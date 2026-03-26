const paymentService = require("../services/paymentService");
const generateResponse = require("../utils/generateResponse");

async function createIntent(req, res, next) {
  try {
    const { orderId } = req.body;

    const result = await paymentService.createPaymentIntent(
      req.user.uid,
      orderId
    );

    return generateResponse(res, 200, true, "Pago creado", result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createIntent
};
