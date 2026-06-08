const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const Food  = require("../models/Food");

// Must match Order model enum exactly:
// "placed","accepted","preparing","ready","picked","delivered","cancelled"
const VALID_STATUSES = ["placed","accepted","preparing","ready","picked","delivered","cancelled"];

// ─────────────────────────────────────────────
// POST /api/orders  — Create order
// ─────────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    // Validate all food IDs exist in DB
    const foodIds = [...new Set(items.map((item) => item.food))];
    const foods   = await Food.find({ _id: { $in: foodIds } });

    if (foods.length !== foodIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more food items are invalid or no longer exist.",
      });
    }

    // Build order items using ONLY fields in orderItemSchema: food, quantity, price
    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const food = foods.find((f) => f._id.toString() === item.food.toString());

      if (!food.availability) {
        throw new Error(`"${food.name}" is currently unavailable.`);
      }

      const quantity = Number(item.quantity);

      // ✅ Use discounted price if offer exists, otherwise regular price
      const discount     = Number(food.discount || 0);
      const basePrice    = Number(food.price);
      const discountAmt  = (basePrice * discount) / 100;
      const finalPrice   = Math.round((basePrice - discountAmt) * 100) / 100;

      totalAmount += finalPrice * quantity;

      // ✅ Only fields that exist in orderItemSchema: food, quantity, price
      return {
        food:     food._id,
        quantity,
        price:    finalPrice,   // ← this was missing / wrong field name
      };
    });

    totalAmount = Math.round(totalAmount * 100) / 100;

    // ✅ Only fields that exist in Order model schema
    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod:   "COD",
      paymentStatus:   "pending",   // ✅ "pending" exists in paymentStatus enum
      orderStatus:     "placed",    // ✅ "placed" is the correct default in orderStatus enum
    });

    const populated = await Order.findById(order._id)
      .populate("user",       "name email phone address")
      .populate("items.food", "name image price category");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: { order: populated },
    });

  } catch (error) {
    // Handle thrown unavailability errors
    if (error.message?.includes("unavailable")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};


// ─────────────────────────────────────────────
// GET /api/orders  — Customer sees own orders
// ─────────────────────────────────────────────
const getOrders = async (req, res, next) => {
  try {
    // Customers only see their own orders
    const query = { user: req.user._id };

    const orders = await Order.find(query)
      .populate("user",       "name email phone address")
      .populate("items.food", "name image price category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────
// GET /api/orders/:id  — Get single order
// ─────────────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user",       "name email phone address")
      .populate("items.food", "name image price category");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Only the owner or admin can view
    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    if (req.user.role !== "admin" && orderUserId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order." });
    }

    return res.status(200).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────
// PATCH /api/orders/:id  — Update status (admin only, via orderRoutes)
// ─────────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus || !VALID_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    order.orderStatus = orderStatus;

    // Auto-update paymentStatus for COD
    if (orderStatus === "delivered") order.paymentStatus = "received";
    if (orderStatus === "cancelled") order.paymentStatus = "pending";

    await order.save();

    const populated = await Order.findById(order._id)
      .populate("user",       "name email phone address")
      .populate("items.food", "name image price category");

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${orderStatus}".`,
      data: { order: populated },
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────
// DELETE /api/orders/:id
// ─────────────────────────────────────────────
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    return res.status(200).json({ success: true, message: "Order deleted.", data: null });
  } catch (error) {
    next(error);
  }
};


module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder };
