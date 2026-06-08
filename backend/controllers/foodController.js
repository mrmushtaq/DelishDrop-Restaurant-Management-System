const { validationResult } = require("express-validator");
const Food = require("../models/Food");

const buildQuery = (queryParams) => {
  const { search, category, minPrice, maxPrice, offers } = queryParams;

  const query = {
    isAvailable: true,
  };

  if (search) {
    query.$text = { $search: search };
  }

  if (category) {
    query.category = category;
  }

  if (offers === "true") {
    query.isOffer = true;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  return query;
};

const getFoods = async (req, res, next) => {
  try {
    const query = buildQuery(req.query);

    let sortOption = { createdAt: -1 };

    if (req.query.sort === "price") sortOption = { price: 1 };
    if (req.query.sort === "price-desc") sortOption = { price: -1 };
    if (req.query.sort === "rating") sortOption = { rating: -1 };
    if (req.query.sort === "name") sortOption = { name: 1 };

    const foods = await Food.find(query)
      .populate("category", "name image")
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: foods.length,
      data: { foods },
    });
  } catch (error) {
    next(error);
  }
};

const getOwnerFoods = async (req, res, next) => {
  try {
    const foods = await Food.find()
      .populate("category", "name image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: foods.length,
      data: { foods },
    });
  } catch (error) {
    next(error);
  }
};

const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate("category", "name image");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

const createFood = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const food = await Food.create({
      name: req.body.name,
      description: req.body.description || "",
      price: req.body.price,
      oldPrice: req.body.oldPrice || 0,
      discount: req.body.discount || 0,
      isOffer: req.body.isOffer || false,
      image: req.body.image || "",
      category: req.body.category,
      isAvailable:
        typeof req.body.isAvailable === "boolean" ? req.body.isAvailable : true,
      rating: req.body.rating || 0,
      calories: req.body.calories || 0,
      prepTime: req.body.prepTime || "20 min",
    });

    const populated = await food.populate("category", "name image");

    return res.status(201).json({
      success: true,
      message: "Food item created successfully.",
      data: { food: populated },
    });
  } catch (error) {
    next(error);
  }
};

const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name image");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully.",
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const isAvailable =
      typeof req.body.isAvailable === "boolean"
        ? req.body.isAvailable
        : req.body.isAvailable?.toString().toLowerCase() === "true";

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name image");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Food marked as ${isAvailable ? "available" : "unavailable"}.`,
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  getOwnerFoods,
  getFoodById,
  createFood,
  updateFood,
  updateAvailability,
  deleteFood,
};