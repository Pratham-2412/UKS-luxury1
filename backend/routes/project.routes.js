const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectMeta,
} = require("../controllers/project.controller");
const { protect, restrictTo, optionalProtect } = require("../middlewares/auth.middleware");

// ─── Public routes ────────────────────────────────────────────────────────────
// NOTE: static routes must come BEFORE /:slug
router.get("/meta", getProjectMeta);
router.get("/featured", getFeaturedProjects);
router.get("/id/:id", protect, restrictTo("admin"), getProjectById);
router.get("/", optionalProtect, getAllProjects);
router.get("/:slug", optionalProtect, getProjectBySlug);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.post("/", protect, restrictTo("admin"), createProject);
router.put("/:id", protect, restrictTo("admin"), updateProject);
router.delete("/:id", protect, restrictTo("admin"), deleteProject);

module.exports = router;