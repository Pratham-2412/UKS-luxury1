const mongoose = require("mongoose");
const slugifyLib = require("slugify");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    collectionSlug: {
      type: String,
      default: "bespoke-kitchens",
    },
    tagline: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    heroImage: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
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

subcategorySchema.pre("save", async function (next) {
  if (!this.isModified("name") && this.slug) return next();

  let baseSlug = slugifyLib(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await mongoose.model("Subcategory").findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model("Subcategory", subcategorySchema);
