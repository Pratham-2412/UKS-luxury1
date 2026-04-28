const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const { protect } = require("../middlewares/auth.middleware");

// GET all testimonials (public: only active, admin: all)
router.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (!req.headers.authorization) query.isActive = true;
    const items = await Testimonial.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items, testimonials: items });
  } catch (err) {
    next(err);
  }
});

// POST create testimonial (admin only)
router.post("/", protect, async (req, res, next) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json({ success: true, message: "Testimonial created", data: item });
  } catch (err) {
    next(err);
  }
});

// PUT update testimonial (admin only)
router.put("/:id", protect, async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      const err = new Error("Testimonial not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: "Testimonial updated", data: item });
  } catch (err) {
    next(err);
  }
});

// DELETE testimonial (admin only)
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) {
      const err = new Error("Testimonial not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;