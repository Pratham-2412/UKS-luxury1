const mongoose = require("mongoose");

const heroSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [180, "Title cannot exceed 180 characters"],
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Subtitle cannot exceed 300 characters"],
    },
    ctaText: { type: String, default: "", trim: true },
    ctaLink: { type: String, default: "", trim: true },
    backgroundImage: { type: String, required: [true, "Background image is required"] },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSection", heroSectionSchema);
