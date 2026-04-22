const Collection = require("../models/Collection.model");
const slugifyLib = require("slugify");

// ─── @route   GET /api/collections  (public) ─────────────────────────────────
const getAllCollections = async (req, res, next) => {
  try {
    const { type, featured, status, page = 1, limit = 20 } = req.query;

    const filter = {};

    // Admin sees ALL statuses; public only sees active collections
    const isAdmin = req.user && req.user.role === "admin";
    if (!isAdmin) filter.status = { $in: ["active"] };

    if (type) filter.type = type;
    if (featured !== undefined) filter.featured = featured === "true";
    // Admin can further filter by a specific status via query param
    if (status && isAdmin) filter.status = status;

    // Ensure page and limit are valid numbers to prevent skip(-1) errors
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [collections, total] = await Promise.all([
      Collection.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Collection.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      collections, // Changed from "data" to "collections" to match frontend
    });
  } catch (error) {
    console.error("Fetch Collections Error:", error);
    next(error);
  }
};

const getCollectionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let collection;

    // Fallback: If slug looks like a MongoDB ID, try searching by ID first
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      collection = await Collection.findById(slug);
    }

    // If not found by ID or not an ID, try searching by slug
    if (!collection) {
      collection = await Collection.findOne({ slug });
    }

    // ─── VIRTUAL FALLBACK ──────────────────────────────────────────────────────
    // If not found in DB, check if it's one of our standard slugs.
    // This allows the page to load even if the user hasn't created it in Admin yet.
    if (!collection) {
      const standardSlugs = [
        "bespoke-kitchens", "dining-rooms", "living-room", "offices",
        "bookcases", "hinged-wardrobes", "sliding-wardrobes", 
        "walk-in-closet", "storage-units"
      ];

      if (standardSlugs.includes(slug)) {
        const title = slug
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return res.status(200).json({
          success: true,
          data: {
            title,
            slug,
            type: "Luxury Collection",
            bannerImage: "",
            shortDescription: `Explore our bespoke ${title} collection.`,
            longDescription: `<p>We are currently updating our ${title} portfolio. Please check back soon for our latest luxury designs or contact us for a private consultation.</p>`,
            gallery: [],
            status: "active"
          }
        });
      }

      const error = new Error(`Collection not found with identifier: ${slug}`);
      error.statusCode = 404;
      return next(error);
    }

    const isAdmin = req.user && req.user.role === "admin";
    if (!isAdmin && collection.status !== "active") {
      const error = new Error("Collection is currently inactive.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error("GET COLLECTION ERROR:", error.message);
    next(error);
  }
};

// ─── @route   GET /api/collections/id/:id  (admin) ───────────────────────────
const getCollectionById = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      const error = new Error("Collection not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/collections  (admin) ─────────────────────────────────
const createCollection = async (req, res, next) => {
  try {
    const {
      title,
      type,
      thumbnail,
      bannerImage,
      shortDescription,
      longDescription,
      gallery,
      featured,
      status,
      order,
    } = req.body;

    if (!title || !type) {
      const error = new Error("Title and type are required.");
      error.statusCode = 400;
      return next(error);
    }

    const collection = await Collection.create({
      title,
      type,
      thumbnail: thumbnail || "",
      bannerImage: bannerImage || "",
      shortDescription: shortDescription || "",
      longDescription: longDescription || "",
      gallery: gallery || [],
      featured: featured || false,
      status: status || "active",
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully.",
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/collections/:id  (admin) ──────────────────────────────
const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      const error = new Error("Collection not found.");
      error.statusCode = 404;
      return next(error);
    }

    const allowedFields = [
      "title",
      "type",
      "thumbnail",
      "bannerImage",
      "shortDescription",
      "longDescription",
      "gallery",
      "featured",
      "status",
      "order",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        collection[field] = req.body[field];
      }
    });

    // Re-generate slug if title changed
    if (req.body.title) {
      collection.slug = undefined; // triggers pre-save hook
    }

    await collection.save();

    res.status(200).json({
      success: true,
      message: "Collection updated successfully.",
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/collections/:id  (admin) ───────────────────────────
const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      const error = new Error("Collection not found.");
      error.statusCode = 404;
      return next(error);
    }

    await collection.deleteOne();

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/collections/types  (public) ───────────────────────────
const getCollectionTypes = (req, res) => {
  const types = [
    "Kitchen",
    "Wardrobe",
    "LivingRoom",
    "Bedroom",
    "Bathroom",
    "HomeOffice",
    "DiningRoom",
    "Entryway",
    "Outdoor",
  ];
  res.status(200).json({ success: true, data: types });
};

module.exports = {
  getAllCollections,
  getCollectionBySlug,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionTypes,
};