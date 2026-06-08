const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAdminStats,
  getOrders,
  updateOrderStatus,
  getUsers,
  getFoods,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require login + admin role
router.use(protect, authorize("admin"));

router.get("/stats",           getAdminStats);
router.get("/orders",          getOrders);
router.patch("/orders/:id/status", updateOrderStatus);  // ✅ dedicated status update route
router.get("/users",           getUsers);
router.get("/foods",           getFoods);

module.exports = router;