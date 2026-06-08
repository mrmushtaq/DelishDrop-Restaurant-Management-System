const express = require("express");
const { body } = require("express-validator");

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const orderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item."),
  body("items.*.food")
    .notEmpty()
    .withMessage("Each item must reference a food item."),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),
  body("deliveryAddress")
    .trim()
    .notEmpty()
    .withMessage("Delivery address is required."),
];

// ✅ Only customers can place orders
router.post("/", protect, authorize("user"), orderValidation, createOrder);

router.get("/", protect, getOrders);

router.get("/:id", protect, getOrderById);

router.patch("/:id", protect, authorize("restaurant_owner", "admin"), updateOrderStatus);

router.delete("/:id", protect, authorize("restaurant_owner", "admin"), deleteOrder);

module.exports = router;