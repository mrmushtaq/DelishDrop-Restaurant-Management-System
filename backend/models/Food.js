const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      maxlength: [100, "Food name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },


    // original price before discount
    oldPrice: {
      type: Number,
      min: [0, "Old price cannot be negative"],
      default: 0,
    },


    // discount percentage
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },


    // show item in Offers page
    isOffer: {
      type: Boolean,
      default: false,
    },


    image: {
      type: String,
      default: "",
    },


    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },


    restaurantOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },


    availability: {
      type: Boolean,
      default: true,
    },


    isAvailable: {
      type: Boolean,
      default: true,
    },


    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },


    calories: {
      type: Number,
      min: [0, "Calories cannot be negative"],
      default: 0,
    },


    prepTime: {
      type: String,
      default: "20 min",
    },
  },

  {
    timestamps: true,
  }
);


// Search index
foodSchema.index({
  name: "text",
  description: "text",
});


module.exports = mongoose.model("Food", foodSchema);