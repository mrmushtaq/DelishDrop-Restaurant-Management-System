const User  = require("../models/User");
const Order = require("../models/Order");
const Food  = require("../models/Food");

// ─────────────────────────────────────────────
// GET /api/admin/stats
// ─────────────────────────────────────────────
const getAdminStats = async (req, res, next) => {
  try {
    const now       = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // ── User counts ──────────────────────────
    const totalCustomers = await User.countDocuments({ role: "user" });
    const totalOrders    = await Order.countDocuments();
    const todayOrders    = await Order.countDocuments({ createdAt: { $gte: todayStart } });

    // ── Revenue (only delivered orders) ─────
    // paymentStatus is NOT required for revenue — COD is paid on delivery
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      {
        $facet: {
          total:   [{ $group: { _id: null, sum: { $sum: "$totalAmount" } } }],
          today:   [{ $match: { createdAt: { $gte: todayStart } } }, { $group: { _id: null, sum: { $sum: "$totalAmount" } } }],
          weekly:  [{ $match: { createdAt: { $gte: weekStart  } } }, { $group: { _id: null, sum: { $sum: "$totalAmount" } } }],
          monthly: [{ $match: { createdAt: { $gte: monthStart } } }, { $group: { _id: null, sum: { $sum: "$totalAmount" } } }],
        },
      },
    ]);

    const rev = revenueAgg[0];
    const totalRevenue   = rev.total[0]?.sum   || 0;
    const todayRevenue   = rev.today[0]?.sum   || 0;
    const weeklyRevenue  = rev.weekly[0]?.sum  || 0;
    const monthlyRevenue = rev.monthly[0]?.sum || 0;

    // ── Order status breakdown ───────────────
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);
    const ordersByStatus = {};
    statusBreakdown.forEach(s => { ordersByStatus[s._id] = s.count; });

    // ── Best selling foods ───────────────────
    const bestSellingFoods = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.food", totalQty: { $sum: "$items.quantity" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "food",
        },
      },
      { $unwind: "$food" },
      {
        $project: {
          _id: 0,
          foodId: "$food._id",
          name:   "$food.name",
          image:  "$food.image",
          totalQty: 1,
        },
      },
    ]);

    // ── Recent orders ────────────────────────
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("items.food", "name price image")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalOrders,
        todayOrders,
        revenue: { totalRevenue, todayRevenue, weeklyRevenue, monthlyRevenue },
        ordersByStatus,
        bestSellingFoods,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────
// GET /api/admin/orders
// ─────────────────────────────────────────────
const getOrders = async (req, res, next) => {
  try {
    // Optional filter by status: /api/admin/orders?status=placed
    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.food", "name price image")
      // restaurantOwner & deliveryRider populated only if set (they can be null)
      .populate("restaurantOwner", "name email")
      .populate("deliveryRider",   "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────
// PATCH /api/admin/orders/:id/status
// ─────────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const VALID_STATUSES = ["placed","accepted","preparing","ready","picked","delivered","cancelled"];

    if (!orderStatus || !VALID_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    )
      .populate("user", "name email phone")
      .populate("items.food", "name price image");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Auto-mark paymentStatus as received when delivered (COD)
    if (orderStatus === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "received";
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to "${orderStatus}".`,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────
// GET /api/admin/users
// ─────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" })
      .select("name email phone address createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────
// GET /api/admin/foods
// ─────────────────────────────────────────────
const getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find()
      .populate("category", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: { foods },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAdminStats,
  getOrders,
  updateOrderStatus,
  getUsers,
  getFoods,
};