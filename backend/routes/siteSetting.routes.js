const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const { getSiteSettings, upsertSiteSettings } = require("../controllers/siteSetting.controller");

router.get("/", getSiteSettings);
router.put("/", protect, restrictTo("admin"), upsertSiteSettings);

module.exports = router;
