const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order.model");
const PaymentRecord = require("../models/PaymentRecord.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── POST /api/payments/create-order ─────────────────────────────────────────
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId, amount, currency = "INR" } = req.body;
    console.log("Creating Razorpay Order with:", { orderId, amount, currency });
    let receipt = `rcpt_${Date.now()}`;

    // If orderId is provided, fetch total from order
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        const error = new Error("Order not found.");
        error.statusCode = 404;
        return next(error);
      }
      finalAmount = Math.round(order.totalAmount * 100);
      receipt = `receipt_${order._id}`;
    } else if (amount) {
      // If no orderId, use direct amount (already in smallest unit or convert)
      finalAmount = amount; 
    } else {
      const error = new Error("Either orderId or amount is required.");
      error.statusCode = 400;
      return next(error);
    }

    const options = {
      amount: finalAmount,
      currency: "INR",
      receipt: receipt,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder, // Returning full order object for frontend compatibility
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    next(error);
  }
};

// ─── POST /api/payments/verify ────────────────────────────────────────────────
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      const error = new Error("Payment verification failed. Invalid signature.");
      error.statusCode = 400;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      razorpay_payment_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRazorpayOrder, verifyPayment };