const Cart = require("../models/Cart");
const Product = require("../models/Product");

function calculateTotals(items) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;
  return { subtotal, total };
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
      subtotal: 0,
      total: 0,
    });
  }

  return cart;
}

async function getCart(userId) {
  return getOrCreateCart(userId);
}

async function addToCart(userId, productId, quantity = 1) {
  const cart = await getOrCreateCart(userId);
  const product = await Product.findById(productId);

  if (!product) throw new Error("Producto no encontrado");
  if (!product.active) throw new Error("Producto no disponible");
  if (product.stock < quantity) throw new Error("Stock insuficiente");

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    if (product.stock < existingItem.quantity + quantity) {
      throw new Error("Stock insuficiente");
    }
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: product._id.toString(),
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.image,
      image: product.image,
      sizeMl: product.size,
      size: product.size,
    });
  }

  const totals = calculateTotals(cart.items);
  cart.subtotal = totals.subtotal;
  cart.total = totals.total;

  await cart.save();
  return cart;
}

async function updateCartItem(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId === productId);

  if (!item) throw new Error("Producto no encontrado en carrito");

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
  } else {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");
    if (product.stock < quantity) throw new Error("Stock insuficiente");
    item.quantity = quantity;
  }

  const totals = calculateTotals(cart.items);
  cart.subtotal = totals.subtotal;
  cart.total = totals.total;

  await cart.save();
  return cart;
}

async function removeCartItem(userId, productId) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((item) => item.productId !== productId);

  const totals = calculateTotals(cart.items);
  cart.subtotal = totals.subtotal;
  cart.total = totals.total;

  await cart.save();
  return cart;
}

async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;

  await cart.save();
  return cart;
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};