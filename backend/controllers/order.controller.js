const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model");

// ─── POST /api/orders (create order) ─────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      contactInfo,
      subtotal,
      shipping,
      total,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId
    } = req.body;

    // Create the order using the data provided from the checkout form
    const order = await Order.create({
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      customerEmail: contactInfo.email,
      customerPhone: contactInfo.phone,
      address: {
        line1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state || "N/A",
        pincode: shippingAddress.postcode,
        country: shippingAddress.country || "United Kingdom",
      },
      items: items.map(item => ({
        product: item._id || item.product,
        name: item.name,
        mainImage: item.mainImage,
        quantity: item.qty,
        price: item.price
      })),
      totalAmount: total,
      subtotal,
      shippingCharge: shipping,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      deliveryStatus: "confirmed"
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("❌ ORDER CREATION ERROR:", error);
    if (error.name === "ValidationError") {
      console.error("Validation Details:", JSON.stringify(error.errors, null, 2));
    }
    next(error);
  }
};

// ─── GET /api/orders (admin — all orders) ────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const { paymentStatus, deliveryStatus, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (deliveryStatus) filter.deliveryStatus = deliveryStatus;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/my-orders (by sessionId) ────────────────────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const sessionId = req.headers["x-session-id"] || req.cookies.sessionId;

    if (!sessionId) {
      return res.status(200).json({ success: true, orders: [] });
    }

    const orders = await Order.find({ sessionId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/orders/:id/status (admin) ──────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { deliveryStatus, paymentStatus } = req.body;

    const update = {};
    if (deliveryStatus) update.deliveryStatus = deliveryStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};