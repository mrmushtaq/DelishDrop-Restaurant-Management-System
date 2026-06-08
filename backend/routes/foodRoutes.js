const express = require("express");
const { body } = require("express-validator");

const {
  getFoods,
  getOwnerFoods,
  getFoodById,
  createFood,
  updateFood,
  updateAvailability,
  deleteFood,
} = require("../controllers/foodController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const foodValidation = [
  body("name").trim().notEmpty().withMessage("Food name is required."),
  body("price")
    .notEmpty().withMessage("Price is required.")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("category").notEmpty().withMessage("Category is required."),
];

// ── Public ────────────────────────────────────────────────
router.get("/", getFoods);
router.get("/owner/all", protect, authorize("restaurant_owner", "admin"), getOwnerFoods);
router.get("/:id", getFoodById);

// ── Admin + Restaurant Owner ──────────────────────────────
router.post(
  "/",
  protect,
  authorize("restaurant_owner", "admin"),  // ✅ admin added
  foodValidation,
  createFood
);

router.put(
  "/:id",
  protect,
  authorize("restaurant_owner", "admin"),  // ✅ admin added
  updateFood
);

router.patch(
  "/:id",
  protect,
  authorize("restaurant_owner", "admin"),  // ✅ admin added
  updateFood
);

router.patch(
  "/:id/availability",
  protect,
  authorize("restaurant_owner", "admin"),  // ✅ admin added
  updateAvailability
);

router.delete(
  "/:id",
  protect,
  authorize("restaurant_owner", "admin"),  // ✅ admin added
  deleteFood
);

module.exports = router;