const express = require("express");
const router = express.Router();
const {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
} = require("../controllers/upload.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// All upload routes are admin-only
router.post("/image", protect, restrictTo("admin"), upload.single("image"), uploadSingleImage);
router.post("/images", protect, restrictTo("admin"), upload.array("images", 10), uploadMultipleImages);
router.delete("/delete", protect, restrictTo("admin"), deleteImage);

module.exports = router;