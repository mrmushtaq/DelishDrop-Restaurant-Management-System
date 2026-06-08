const express = require("express");
const { body }  = require("express-validator");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  patchCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect }   = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

const categoryValidation = [
  body("name").trim().notEmpty().withMessage("Category name is required."),
];

router.get("/",      getCategories);
router.get("/:id",   getCategoryById);
router.post("/",     protect, adminOnly, categoryValidation, createCategory);
router.put("/:id",   protect, adminOnly, updateCategory);
router.patch("/:id", protect, adminOnly, patchCategory);
router.delete("/:id",protect, adminOnly, deleteCategory);

module.exports = router;