const mongoose = require("mongoose");

const heroSectionSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, trim: true },
    heading: {
      type: String,
      required: [true, "Heading is required"],
      trim: true,
    },
    subheading: {
      type: String,
      trim: true,
    },
    image: { type: String, required: [true, "Image is required"] },
    ctaLabel: { type: String, default: "", trim: true },
    ctaLink: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSection", heroSectionSchema);
