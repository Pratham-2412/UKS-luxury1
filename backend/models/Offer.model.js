const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    // Single image field — stored as "image", aliased from "thumbnail" in controller
    image: {
      type: String,
      default: "",
    },
    discountText: {
      type: String,
      default: "",
    },
    ctaLabel: {
      type: String,
      default: "",
    },
    ctaLink: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title
offerSchema.pre("save", function (next) {
  if (this.isModified("title") && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

// Virtual: is the offer currently live
offerSchema.virtual("isLive").get(function () {
  const now = new Date();
  const afterStart = !this.startDate || this.startDate <= now;
  const beforeEnd  = !this.endDate   || this.endDate   >= now;
  return this.isActive && afterStart && beforeEnd;
});

offerSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Offer", offerSchema);