const mongoose = require("mongoose");
const slugifyLib = require("slugify");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
      default: "",
    },
    longDescription: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    galleryImages: {
      type: [Object], // { url: String, description: String }
      default: [],
    },
    category: {
      type: String,
      required: [true, "Project category is required"],
    },
    style: {
      type: String,
      default: "Modern",
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    clientName: {
      type: String,
      trim: true,
      default: "",
    },
    area: {
      type: String,
      trim: true,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived", "active", "inactive"],
      default: "published",
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
projectSchema.pre("save", async function (next) {
  if (!this.isModified("title") && this.slug) return next();

  let baseSlug = slugifyLib(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (
    await mongoose.model("Project").findOne({ slug, _id: { $ne: this._id } })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model("Project", projectSchema);