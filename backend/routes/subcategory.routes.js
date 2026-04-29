const express = require("express");
const {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategory.controller");

const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/")
  .get(getSubcategories)
  .post(protect, restrictTo("admin"), createSubcategory);

router.route("/:slug")
  .get(getSubcategory);

router.route("/:id")
  .put(protect, restrictTo("admin"), updateSubcategory)
  .delete(protect, restrictTo("admin"), deleteSubcategory);

module.exports = router;
