const SubcategoryItem = require("../models/SubcategoryItem.model");

// @desc    Get all subcategory items
// @route   GET /api/subcategory-items
// @access  Public
exports.getSubcategoryItems = async (req, res, next) => {
  try {
    const { subcategoryId, subcategorySlug, status } = req.query;

    let query = {};

    if (subcategoryId) {
      query.parentSubcategory = subcategoryId;
    }

    // If not an admin, only show active items
    if (!req.user || req.user.role !== "admin") {
      query.status = "active";
    } else if (status) {
      query.status = status;
    }

    const items = await SubcategoryItem.find(query)
      .populate('parentSubcategory', 'name slug')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get items by subcategory slug
// @route   GET /api/subcategory-items/by-subcategory/:slug
// @access  Public
exports.getItemsBySubcategorySlug = async (req, res, next) => {
  try {
    const Subcategory = require("../models/Subcategory.model");
    const subcategory = await Subcategory.findOne({ slug: req.params.slug });
    
    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    const query = { parentSubcategory: subcategory._id };
    
    if (!req.user || req.user.role !== "admin") {
      query.status = "active";
    }

    const items = await SubcategoryItem.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single item
// @route   GET /api/subcategory-items/:id
// @access  Public
exports.getSubcategoryItem = async (req, res, next) => {
  try {
    const item = await SubcategoryItem.findById(req.params.id).populate('parentSubcategory', 'name slug');

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new item
// @route   POST /api/subcategory-items
// @access  Private/Admin
exports.createSubcategoryItem = async (req, res, next) => {
  try {
    const item = await SubcategoryItem.create(req.body);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update item
// @route   PUT /api/subcategory-items/:id
// @access  Private/Admin
exports.updateSubcategoryItem = async (req, res, next) => {
  try {
    let item = await SubcategoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    item = await SubcategoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete item
// @route   DELETE /api/subcategory-items/:id
// @access  Private/Admin
exports.deleteSubcategoryItem = async (req, res, next) => {
  try {
    const item = await SubcategoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
