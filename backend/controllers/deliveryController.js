const Order = require("../models/Order");
const { getIo } = require("../config/socket");

const getAvailableDeliveries = async (req, res, next) => {
  try {
    const orders = await Order.find({
      orderStatus: "ready",
      $or: [
        { deliveryRider: null },
        { deliveryRider: req.user._id },
      ],
    })
      .populate("user", "name email")
      .populate("items.food", "name price image")
      .populate("restaurantOwner", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: orders.length, data: { orders } });
  } catch (error) {
    next(error);
  }
};

const acceptDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.orderStatus !== "ready") {
      return res.status(400).json({ success: false, message: "Only ready orders can be accepted." });
    }

    if (order.deliveryRider && order.deliveryRider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Order already assigned to another rider." });
    }

    order.deliveryRider = req.user._id;
    order.orderStatus = "picked";
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.food", "name price image")
      .populate("restaurantOwner", "name email")
      .populate("deliveryRider", "name email");

    const io = getIo();
    io.to(`user_${order.user.toString()}`).emit("delivery_updated", { order: populated });

    res.status(200).json({ success: true, message: "Order accepted for delivery.", data: { order: populated } });
  } catch (error) {
    next(error);
  }
};

const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (!order.deliveryRider || order.deliveryRider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this delivery." });
    }

    if (status !== "delivered") {
      return res.status(400).json({ success: false, message: "Delivery status can only be updated to delivered." });
    }

    if (order.orderStatus !== "picked") {
      return res.status(400).json({ success: false, message: "Only picked orders can be marked as delivered." });
    }

    order.orderStatus = "delivered";
    order.paymentStatus = "received";
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.food", "name price image")
      .populate("restaurantOwner", "name email")
      .populate("deliveryRider", "name email");

    const io = getIo();
    io.to(`user_${order.user.toString()}`).emit("delivery_updated", { order: populated });

    res.status(200).json({ success: true, message: "Delivery status updated to delivered.", data: { order: populated } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAvailableDeliveries, acceptDelivery, updateDeliveryStatus };
