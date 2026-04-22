const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const {
  getHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
} = require("../controllers/heroSection.controller");

router.get("/", getHeroSections);
router.post("/", protect, restrictTo("admin"), createHeroSection);
router.put("/:id", protect, restrictTo("admin"), updateHeroSection);
router.delete("/:id", protect, restrictTo("admin"), deleteHeroSection);

module.exports = router;
