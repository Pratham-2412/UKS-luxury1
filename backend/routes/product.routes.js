const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getRecommendedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Public — specific routes BEFORE /:slug
router.get("/recommended", getRecommendedProducts);
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin
router.post("/", protect, restrictTo("admin"), createProduct);
router.put("/:id", protect, restrictTo("admin"), updateProduct);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

module.exports = router;