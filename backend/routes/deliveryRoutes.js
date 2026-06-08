const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");

const router = express.Router();

router.get("/orders", protect, authorize("delivery_rider"), getAvailableDeliveries);
router.patch("/orders/:id/accept", protect, authorize("delivery_rider"), acceptDelivery);
router.patch("/orders/:id/status", protect, authorize("delivery_rider"), updateDeliveryStatus);

module.exports = router;
