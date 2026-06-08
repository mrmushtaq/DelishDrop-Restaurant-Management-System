const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { toggleFavourite, getFavourites } = require("../controllers/favouriteController");

const router = express.Router();

// All routes require login
router.use(protect);

router.get("/",           getFavourites);    // GET  /api/favourites
router.post("/:foodId",   toggleFavourite);  // POST /api/favourites/:foodId

module.exports = router;