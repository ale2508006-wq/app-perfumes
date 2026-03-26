const orderService = require("../services/orderService");
const generateResponse = require("../utils/generateResponse");

async function createOrder(req, res, next) {
  try {
    const { shippingAddress = {}, paymentIntentId = "" } = req.body;

    const order = await orderService.createOrder(
      req.user.uid,
      shippingAddress,
      paymentIntentId
    );

    return generateResponse(
      res,
      201,
      true,
      "Pedido creado correctamente",
      order
    );
  } catch (error) {
    next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await orderService.getOrders(req.user.uid);

    return generateResponse(
      res,
      200,
      true,
      "Pedidos obtenidos correctamente",
      orders
    );
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.user.uid, req.params.id);

    if (!order) {
      return generateResponse(res, 404, false, "Pedido no encontrado");
    }

    return generateResponse(
      res,
      200,
      true,
      "Pedido obtenido correctamente",
      order
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};