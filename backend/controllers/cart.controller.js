const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");

// Helper: get or create cart by sessionId
const getOrCreateCart = async (sessionId) => {
  let cart = await Cart.findOne({ sessionId }).populate(
    "items.product",
    "name slug mainImage price salePrice stock status"
  );
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }
  return cart;
};

// ─── GET /api/cart (get cart) ─────────────────────────────────────────────────
const getCart = async (req, res, next) => {
  try {
    const sessionId = req.headers["x-session-id"] || req.cookies.sessionId;

    if (!sessionId) {
      return res.status(200).json({ success: true, cart: { items: [], totalAmount: 0 } });
    }

    const cart = await getOrCreateCart(sessionId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/cart/add ───────────────────────────────────────────────────────
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const sessionId = req.headers["x-session-id"] || req.cookies.sessionId;

    if (!sessionId) {
      const error = new Error("Session ID is required.");
      error.statusCode = 400;
      return next(error);
    }

    if (!productId) {
      const error = new Error("Product ID is required.");
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      return next(error);
    }

    if (product.status !== "active") {
      const error = new Error("Product is not available.");
      error.statusCode = 400;
      return next(error);
    }

    if (product.stock < quantity) {
      const error = new Error(`Only ${product.stock} items available in stock.`);
      error.statusCode = 400;
      return next(error);
    }

    const effectivePrice =
      product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
      existingItem.price = effectivePrice;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price: effectivePrice });
    }

    await cart.save();
    await cart.populate("items.product", "name slug mainImage price salePrice stock status");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/cart/update ─────────────────────────────────────────────────────
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const sessionId = req.headers["x-session-id"] || req.cookies.sessionId;

    if (!sessionId || !productId || !quantity) {
      const error = new Error("sessionId, productId, and quantity are required.");
      error.statusCode = 400;
      return next(error);
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      const error = new Error("Cart not found.");
      error.statusCode = 404;
      return next(error);
    }

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) {
      const error = new Error("Item not found in cart.");
      error.statusCode = 404;
      return next(error);
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    await cart.populate("items.product", "name slug mainImage price salePrice stock status");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart/remove/:productId ──────────────────────────────────────
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const sessionId = req.headers["x-session-id"] || req.cookies.sessionId;

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      const error = new Error("Cart not found.");
      error.statusCode = 404;
      return next(error);
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    await cart.populate("items.product", "name slug mainImage price salePrice stock status");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart/clear ───────────────────────────────────────────────────
const clearCart = async (req, res, next) => {
  try {
    const sessionId = req.headers["x-session-id"] || req.cookies.sessionId;

    await Cart.findOneAndDelete({ sessionId });

    res.status(200).json({ success: true, message: "Cart cleared." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };