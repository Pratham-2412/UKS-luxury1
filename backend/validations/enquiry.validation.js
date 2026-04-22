const { body } = require("express-validator");

const enquiryValidation = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters")
    .trim(),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("message")
    .notEmpty().withMessage("Message is required")
    .isLength({ max: 2000 }).withMessage("Message cannot exceed 2000 characters")
    .trim(),

  body("phone")
    .optional()
    .isMobilePhone().withMessage("Please provide a valid phone number"),

  body("inquiryType")
    .optional()
    .isIn([
      "general", "consultation", "bespoke-kitchen", "wardrobe",
      "living-room", "dining-room", "home-office", "full-project",
      "shop", "collection", "product", "order", "other"
    ])
    .withMessage("Invalid inquiry type"),
];

module.exports = { enquiryValidation };