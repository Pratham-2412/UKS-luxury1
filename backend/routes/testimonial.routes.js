const express = require("express");
const router = express.Router();

// Dummy route (you can replace with controller later)
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Testimonials working",
    data: [],
  });
});

module.exports = router;