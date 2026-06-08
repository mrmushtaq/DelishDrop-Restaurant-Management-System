const { validationResult } = require("express-validator");
const Category = require("../models/Category");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (full)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Partial update category
// @route   PATCH /api/categories/:id
// @access  Private/Admin
const patchCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({
      success: true,
      message: "Category patched successfully.",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  patchCategory,
  deleteCategory,
};