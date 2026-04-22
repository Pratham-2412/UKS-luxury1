const express = require("express");
const router = express.Router();
const { login, logout, getMe, changePassword } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { loginValidation } = require("../validations/auth.validation");

router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);

module.exports = router;