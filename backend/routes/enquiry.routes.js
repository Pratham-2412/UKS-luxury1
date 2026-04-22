const express = require("express");
const router = express.Router();
const {
  submitEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
} = require("../controllers/enquiry.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const { enquiryValidation } = require("../validations/enquiry.validation");

// Public
router.post("/", enquiryValidation, submitEnquiry);

// Admin
router.get("/", protect, restrictTo("admin"), getAllEnquiries);
router.get("/stats", protect, restrictTo("admin"), getEnquiryStats);
router.get("/:id", protect, restrictTo("admin"), getEnquiryById);
router.put("/:id", protect, restrictTo("admin"), updateEnquiry);
router.delete("/:id", protect, restrictTo("admin"), deleteEnquiry);

module.exports = router;