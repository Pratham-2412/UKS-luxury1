const Product = require("../models/Product.model");

// ─── GET /api/products (public — filters, sort, pagination) ──────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      status,
      featured,
      recommended,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      search,
    } = req.query;

    const filter = { status: "active" };

    if (category) filter.category = category;
    if (featured) filter.featured = featured === "true";
    if (recommended) filter.recommended = recommended === "true";
    if (status && req.isAdmin) filter.status = status;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      name: { name: 1 },
    };

    const sortBy = sortOptions[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/products/recommended (public) ───────────────────────────────────
const getRecommendedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ recommended: true, status: "active" })
      .populate("category", "name slug")
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/products/:slug (public) ────────────────────────────────────────
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("collectionRef", "title slug");

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      return next(error);
    }

    // Related products — same category, exclude current
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "active",
    })
      .limit(4)
      .select("name slug mainImage price salePrice");

    res.status(200).json({ success: true, product, related });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/products (admin) ───────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    console.log("📦 CREATE PRODUCT DATA:", JSON.stringify(req.body, null, 2));
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", error);
    next(error);
  }
};

// ─── PUT /api/products/:id (admin) ────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("❌ UPDATE PRODUCT ERROR:", error);
    next(error);
  }
};

// ─── DELETE /api/products/:id (admin) ─────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getRecommendedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};