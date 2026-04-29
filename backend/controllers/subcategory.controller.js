const Subcategory = require("../models/Subcategory.model");

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
exports.getSubcategories = async (req, res, next) => {
  try {
    const { collectionSlug, status } = req.query;

    const query = {};
    if (collectionSlug) query.collectionSlug = collectionSlug;
    
    // If not an admin, only show active subcategories
    if (!req.user || req.user.role !== "admin") {
      query.status = "active";
    } else if (status) {
      query.status = status;
    }

    const subcategories = await Subcategory.find(query).sort({ order: 1, createdAt: -1 }).lean();

    const SubcategoryItem = require("../models/SubcategoryItem.model");
    
    // For each subcategory, find the first item to get a fallback image
    const subcategoriesWithFallback = await Promise.all(subcategories.map(async (sub) => {
      const firstItem = await SubcategoryItem.findOne({ parentSubcategory: sub._id, status: 'active' }).sort({ order: 1, createdAt: -1 });
      return {
        ...sub,
        firstItemImage: firstItem && firstItem.images && firstItem.images.length > 0 ? firstItem.images[0] : null
      };
    }));

    res.status(200).json({
      success: true,
      count: subcategoriesWithFallback.length,
      data: subcategoriesWithFallback,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single subcategory
// @route   GET /api/subcategories/:slug
// @access  Public
exports.getSubcategory = async (req, res, next) => {
  try {
    const query = { slug: req.params.slug };
    
    if (!req.user || req.user.role !== "admin") {
      query.status = "active";
    }

    const subcategory = await Subcategory.findOne(query);

    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    res.status(200).json({
      success: true,
      data: subcategory,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new subcategory
// @route   POST /api/subcategories
// @access  Private/Admin
exports.createSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.create(req.body);

    res.status(201).json({
      success: true,
      data: subcategory,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update subcategory
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
exports.updateSubcategory = async (req, res, next) => {
  try {
    let subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: subcategory,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete subcategory
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
exports.deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    await subcategory.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
