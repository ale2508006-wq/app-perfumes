const cartService = require("../services/cartService");
const generateResponse = require("../utils/generateResponse");

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.user.uid);
    return generateResponse(res, 200, true, "Carrito obtenido", cart);
  } catch (error) {
    next(error);
  }
}

async function addToCart(req, res, next) {
  try {
    const cart = await cartService.addToCart(
      req.user.uid,
      req.body.productId,
      req.body.quantity
    );
    return generateResponse(res, 200, true, "Producto agregado al carrito", cart);
  } catch (error) {
    next(error);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const cart = await cartService.updateCartItem(
      req.user.uid,
      req.params.productId,
      req.body.quantity
    );
    return generateResponse(res, 200, true, "Carrito actualizado", cart);
  } catch (error) {
    next(error);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const cart = await cartService.removeCartItem(req.user.uid, req.params.productId);
    return generateResponse(res, 200, true, "Producto eliminado del carrito", cart);
  } catch (error) {
    next(error);
  }
}

async function clearCart(req, res, next) {
  try {
    const cart = await cartService.clearCart(req.user.uid);
    return generateResponse(res, 200, true, "Carrito vaciado", cart);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
