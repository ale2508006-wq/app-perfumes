const Product = require("../models/Product");

async function getProducts(filters = {}) {
  const query = {};

  if (typeof filters.active === "boolean") {
    query.active = filters.active;
  }

  if (filters.gender) {
    query.category = filters.gender;
  }

  if (filters.maxPrice) {
    query.price = { $lte: Number(filters.maxPrice) };
  }

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }

  return Product.find(query).sort({ createdAt: -1 });
}

async function getProductById(id) {
  return Product.findById(id);
}

async function createProduct(data) {
  return Product.create({
    name: data.name,
    price: Number(data.price),
    stock: Number(data.stock),
    size: Number(data.size),
    category: data.category,
    image: data.image,
    description: data.description || "",
    active: true,
  });
}

async function updateProduct(id, data) {
  return Product.findByIdAndUpdate(
    id,
    {
      name: data.name,
      price: Number(data.price),
      stock: Number(data.stock),
      size: Number(data.size),
      category: data.category,
      image: data.image,
      description: data.description || "",
    },
    { new: true, runValidators: true }
  );
}

async function deleteProduct(id) {
  return Product.findByIdAndDelete(id);
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};