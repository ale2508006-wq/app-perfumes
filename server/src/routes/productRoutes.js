const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getProducts);

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("administrador"),
  getAdminProducts
);

router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("administrador"),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("administrador"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("administrador"),
  deleteProduct
);

module.exports = router;