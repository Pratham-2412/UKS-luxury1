const mongoose = require("mongoose");
const slugifyLib = require("slugify");

const subcategoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parentSubcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    images: {
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

subcategoryItemSchema.pre("save", async function (next) {
  if (!this.isModified("name") && this.slug) return next();

  let baseSlug = slugifyLib(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await mongoose.model("SubcategoryItem").findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model("SubcategoryItem", subcategoryItemSchema);
