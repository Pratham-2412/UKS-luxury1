const mongoose = require("mongoose");
const slugifyLib = require("slugify");

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Collection title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Collection type is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [1000, "Short description cannot exceed 1000 characters"],
      default: "",
    },
    longDescription: {
      type: String,
      default: "",
    },
    gallery: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Auto-generate slug before saving ────────────────────────────────────────
collectionSchema.pre("save", async function (next) {
  if (!this.isModified("title") && this.slug) return next();

  let baseSlug = slugifyLib(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Ensure uniqueness
  while (await mongoose.model("Collection").findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model("Collection", collectionSchema);