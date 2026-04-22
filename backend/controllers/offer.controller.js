const Offer = require("../models/Offer.model");

// Helper: build a DB-ready object from request body
const buildOfferFields = (body) => {
  const {
    title, description,
    thumbnail, image,      // admin form sends "thumbnail"; public model stores "image"
    discountText,
    ctaLabel, ctaLink,
    startDate, endDate,
    isActive, featured,
  } = body;

  const fields = {};
  if (title        !== undefined) fields.title        = title;
  if (description  !== undefined) fields.description  = description;
  // Accept either "thumbnail" (admin form) or "image" (direct)
  const img = thumbnail || image;
  if (img          !== undefined) fields.image        = img;
  if (discountText !== undefined) fields.discountText = discountText;
  if (ctaLabel     !== undefined) fields.ctaLabel     = ctaLabel;
  if (ctaLink      !== undefined) fields.ctaLink      = ctaLink;
  if (startDate    !== undefined) fields.startDate    = startDate || null;
  if (endDate      !== undefined) fields.endDate      = endDate   || null;
  if (isActive     !== undefined) fields.isActive     = isActive;
  if (featured     !== undefined) fields.featured     = featured;
  return fields;
};

// ─── GET /api/offers  (public — active + within date range) ──────────────────
const getActiveOffers = async (req, res, next) => {
  try {
    const now = new Date();
    const filter = { isActive: true };

    // Only apply date filter when dates are set
    // $or: no dates set at all  OR  within the date window
    filter.$and = [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate:   null }, { endDate:   { $gte: now } }] },
    ];

    const offers = await Offer.find(filter).sort({ featured: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: offers.length, offers });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/offers/admin/all  (admin — all offers) ─────────────────────────
const getAllOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: offers.length, offers });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/offers/:id  (public) ───────────────────────────────────────────
const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      const error = new Error("Offer not found.");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/offers  (admin) ────────────────────────────────────────────────
const createOffer = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      const error = new Error("Offer title is required.");
      error.statusCode = 400;
      return next(error);
    }

    const { startDate, endDate } = req.body;
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      const error = new Error("End date must be after start date.");
      error.statusCode = 400;
      return next(error);
    }

    const offer = await Offer.create(buildOfferFields(req.body));
    res.status(201).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/offers/:id  (admin) ─────────────────────────────────────────────
const updateOffer = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      const error = new Error("End date must be after start date.");
      error.statusCode = 400;
      return next(error);
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      buildOfferFields(req.body),
      { new: true, runValidators: true }
    );

    if (!offer) {
      const error = new Error("Offer not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/offers/:id  (admin) ──────────────────────────────────────────
const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      const error = new Error("Offer not found.");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, message: "Offer deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveOffers,
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};