const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand.model");
const { protect } = require("../middlewares/auth.middleware");

// GET all brands (public: only active, admin: all)
router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (!req.headers.authorization) query.isActive = true;
    const items = await Brand.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: items.length, data: items, brands: items });
  } catch (err) {
    next(err);
  }
});

// POST create brand (admin only)
router.post("/", protect, async (req, res, next) => {
  try {
    const item = await Brand.create(req.body);
    res.status(201).json({ success: true, message: "Brand created", data: item });
  } catch (err) {
    next(err);
  }
});

// PUT update brand (admin only)
router.put("/:id", protect, async (req, res, next) => {
  try {
    const item = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      const err = new Error("Brand not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: "Brand updated", data: item });
  } catch (err) {
    next(err);
  }
});

// DELETE brand (admin only)
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const item = await Brand.findByIdAndDelete(req.params.id);
    if (!item) {
      const err = new Error("Brand not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: "Brand deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
