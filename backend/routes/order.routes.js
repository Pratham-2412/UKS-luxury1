const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Public
router.post("/", createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin
router.get("/", protect, restrictTo("admin"), getAllOrders);
router.put("/:id/status", protect, restrictTo("admin"), updateOrderStatus);
router.delete("/:id", protect, restrictTo("admin"), deleteOrder);

module.exports = router;