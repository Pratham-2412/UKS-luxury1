const express = require("express");
const router = express.Router();
const {
  getAllCollections,
  getCollectionBySlug,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionTypes,
} = require("../controllers/collection.controller");
const { protect, restrictTo, optionalProtect } = require("../middlewares/auth.middleware");

// ─── Public routes ────────────────────────────────────────────────────────────
// NOTE: /types and /id/:id must come BEFORE /:slug to avoid route conflicts
router.get("/types", getCollectionTypes);
router.get("/", optionalProtect, getAllCollections);
router.get("/id/:id", protect, restrictTo("admin"), getCollectionById);   // admin use
router.get("/:slug", getCollectionBySlug);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.post("/", protect, restrictTo("admin"), createCollection);
router.put("/:id", protect, restrictTo("admin"), updateCollection);
router.delete("/:id", protect, restrictTo("admin"), deleteCollection);

module.exports = router;