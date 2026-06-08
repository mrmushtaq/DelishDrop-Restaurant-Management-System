const express = require("express");
const { body } = require("express-validator");
const router   = express.Router();

const authController  = require("../controllers/authController");
const { protect }     = require("../middleware/authMiddleware");

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters."),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),
  body("password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),
  body("password")
    .notEmpty().withMessage("Password is required."),
];

// Routes
router.post("/register", registerValidation, authController.register);
router.post("/login",    loginValidation,    authController.login);
router.get("/me",        protect,            authController.getMe);

const { register, login, getMe, updateProfile } = require("../controllers/authController");

router.patch("/profile", protect, updateProfile);

module.exports = router;