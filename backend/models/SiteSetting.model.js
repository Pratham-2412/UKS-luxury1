const mongoose = require("mongoose");

const socialLinksSchema = new mongoose.Schema(
  {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    pinterest: { type: String, default: "" },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "UKS Luxury Interiors" },
    metaDescription: { type: String, default: "Luxury interiors, furniture, and projects." },
    metaKeywords: { type: [String], default: [] },
  },
  { _id: false }
);

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "UKS Luxury Interiors",
      trim: true,
      maxlength: [120, "Site name cannot exceed 120 characters"],
    },
    logo: { type: String, default: "" },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
