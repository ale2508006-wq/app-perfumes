const productService = require("../services/productService");

async function getProducts(req, res) {
  try {
    const products = await productService.getProducts({
      active: true,
      gender: req.query.gender,
      search: req.query.search,
      maxPrice: req.query.maxPrice,
    });

    res.json(products);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
}

async function getAdminProducts(req, res) {
  try {
    const products = await productService.getProducts({
      gender: req.query.gender,
      search: req.query.search,
      maxPrice: req.query.maxPrice,
    });

    res.json(products);
  } catch (error) {
    console.error("Error obteniendo productos del administrador:", error);
    res.status(500).json({ message: "Error al obtener productos del administrador" });
  }
}

async function getProductById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
}

async function createProduct(req, res) {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(400).json({ message: error.message || "Error al crear producto" });
  }
}

async function updateProduct(req, res) {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(400).json({ message: error.message || "Error al actualizar producto" });
  }
}

async function deleteProduct(req, res) {
  try {
    const deleted = await productService.deleteProduct(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
}

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};