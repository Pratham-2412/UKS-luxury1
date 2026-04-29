const express = require("express");
const {
  getSubcategoryItems,
  getItemsBySubcategorySlug,
  getSubcategoryItem,
  createSubcategoryItem,
  updateSubcategoryItem,
  deleteSubcategoryItem,
} = require("../controllers/subcategoryItem.controller");

const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/")
  .get(getSubcategoryItems)
  .post(protect, restrictTo("admin"), createSubcategoryItem);

router.route("/by-subcategory/:slug")
  .get(getItemsBySubcategorySlug);

router.route("/:id")
  .get(getSubcategoryItem)
  .put(protect, restrictTo("admin"), updateSubcategoryItem)
  .delete(protect, restrictTo("admin"), deleteSubcategoryItem);

module.exports = router;
