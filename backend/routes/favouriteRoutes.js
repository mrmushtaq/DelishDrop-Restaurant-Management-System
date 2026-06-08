const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { toggleFavourite, getFavourites } = require("../controllers/favouriteController");

const router = express.Router();

router.use(protect);
router.get("/", getFavourites);
router.post("/:foodId", toggleFavourite);

module.exports = router;