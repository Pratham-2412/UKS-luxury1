const Category = require("../models/Category.model");

// GET /api/categories (public)
const getAllCategories = async (req, res, next) => {
  try {
    const filter = req.query.all ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

// POST /api/categories (admin)
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id (admin)
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      const error = new Error("Category not found.");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id (admin)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      const error = new Error("Category not found.");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };