const Project = require("../models/Project.model");

// ─── @route   GET /api/projects  (public) ────────────────────────────────────
const getAllProjects = async (req, res, next) => {
  try {
    const {
      category,
      style,
      featured,
      status,
      year,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const filter = {};

    const isAdmin = req.user && req.user.role === "admin";

    // Admin sees ALL statuses; public only sees active/published
    if (!isAdmin) {
      filter.status = { $in: ["active", "published"] };
    }

    if (category) filter.category = category;
    if (style) filter.style = style;
    if (year) filter.year = Number(year);
    if (featured !== undefined) filter.featured = featured === "true";
    // Admin can further filter by a specific status via query param
    if (status && isAdmin) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sortObj = {};
    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
    sortObj[sortField] = sort.startsWith("-") ? -1 : 1;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ order: 1, ...sortObj })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      projects,   // ← used by admin panel
      data: projects, // ← kept for backwards compatibility
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/projects/featured  (public) ───────────────────────────
const getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ featured: true, status: { $in: ["active", "published"] } })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/projects/:slug  (public) ──────────────────────────────
const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      const error = new Error("Project not found.");
      error.statusCode = 404;
      return next(error);
    }

    const isAdmin = req.user && req.user.role === "admin";
    const isVisible = ["active", "published"].includes(project.status);
    if (!isAdmin && !isVisible) {
      const error = new Error("Project not found.");
      error.statusCode = 404;
      return next(error);
    }

    // Get related projects (same category, exclude current)
    const related = await Project.find({
      category: project.category,
      status: { $in: ["active", "published"] },
      _id: { $ne: project._id },
    })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: project,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/projects/id/:id  (admin) ──────────────────────────────
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      const error = new Error("Project not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/projects  (admin) ────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      category,
      shortDescription,
      longDescription,
      thumbnail,
      galleryImages,
      style,
      year,
      location,
      clientName,
      area,
      featured,
      status,
      order,
    } = req.body;

    if (!title) {
      const error = new Error("Title is required.");
      error.statusCode = 400;
      return next(error);
    }

    // Default category if missing
    const projectCategory = category || "General";

    const project = await Project.create({
      title,
      category: projectCategory,
      shortDescription: shortDescription || "",
      longDescription: longDescription || "",
      thumbnail: thumbnail || "",
      galleryImages: galleryImages || [],
      style: style || "Modern",
      year: year || new Date().getFullYear(),
      location: location || "",
      clientName: clientName || "",
      area: area || "",
      featured: featured || false,
      status: status || "published",
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/projects/:id  (admin) ─────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      const error = new Error("Project not found.");
      error.statusCode = 404;
      return next(error);
    }

    const allowedFields = [
      "title",
      "category",
      "shortDescription",
      "longDescription",
      "thumbnail",
      "galleryImages",
      "style",
      "year",
      "location",
      "clientName",
      "area",
      "featured",
      "status",
      "order",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Re-generate slug only if the title actually changed
    if (req.body.title && req.body.title !== project.title) {
      project.slug = undefined;
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/projects/:id  (admin) ──────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      const error = new Error("Project not found.");
      error.statusCode = 404;
      return next(error);
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/projects/meta  (public) ───────────────────────────────
const getProjectMeta = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      categories: [
        "Kitchen", "Wardrobe", "LivingRoom", "Bedroom",
        "Bathroom", "HomeOffice", "DiningRoom", "Entryway", "Outdoor",
      ],
      styles: [
        "Modern", "Contemporary", "Classic", "Minimalist",
        "Industrial", "Scandinavian", "Bohemian", "Transitional", "Other",
      ],
    },
  });
};

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectMeta,
};