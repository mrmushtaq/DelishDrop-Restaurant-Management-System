const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },

  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "Order must have at least one item",
      },
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },

    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "received"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "preparing",
        "ready",
        "picked",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },

    restaurantOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deliveryRider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deliveryAddress: {
      type: String,
      trim: true,
      required: [true, "Delivery address is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);