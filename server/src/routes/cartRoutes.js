const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, cartController.getCart);
router.post("/add", authMiddleware, cartController.addToCart);
router.put("/update/:productId", authMiddleware, cartController.updateCartItem);
router.delete("/remove/:productId", authMiddleware, cartController.removeCartItem);
router.delete("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
