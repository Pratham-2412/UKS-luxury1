const express = require("express");
const router = express.Router();
const {
  getActiveOffers,
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offer.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// ─── Static routes FIRST (before /:id) ───────────────────────────────────────
// Admin: get all offers regardless of status/date
router.get("/admin/all", protect, restrictTo("admin"), getAllOffers);

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/",    getActiveOffers);   // active + within date range
router.get("/:id", getOfferById);      // single offer by ID

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.post("/",    protect, restrictTo("admin"), createOffer);
router.put("/:id",  protect, restrictTo("admin"), updateOffer);
router.delete("/:id", protect, restrictTo("admin"), deleteOffer);

module.exports = router;