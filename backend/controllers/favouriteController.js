const User = require("../models/User");

const toggleFavourite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const foodId = req.params.foodId;
    const index = user.favourites.findIndex(id => id.toString() === foodId);

    if (index === -1) {
      user.favourites.push(foodId);
    } else {
      user.favourites.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: { favourites: user.favourites },
    });
  } catch (error) {
    next(error);
  }
};

const getFavourites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favourites",
      "name description price oldPrice discount image category rating availability"
    );
    res.status(200).json({
      success: true,
      count: user.favourites.length,
      data: { favourites: user.favourites },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { toggleFavourite, getFavourites };