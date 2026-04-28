const HeroSection = require("../models/HeroSection.model");

const getHeroSections = async (req, res, next) => {
  try {
    const query = {};
    if (!req.user) query.isActive = true;

    const items = await HeroSection.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

const createHeroSection = async (req, res, next) => {
  try {
    const item = await HeroSection.create(req.body);
    res.status(201).json({
      success: true,
      message: "Hero section created successfully.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const updateHeroSection = async (req, res, next) => {
  try {
    const item = await HeroSection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      const err = new Error("Hero section not found.");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHeroSection = async (req, res, next) => {
  try {
    const item = await HeroSection.findByIdAndDelete(req.params.id);

    if (!item) {
      const err = new Error("Hero section not found.");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: "Hero section deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
};
