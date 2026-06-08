const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ✅ Protect — verify JWT and attach user to req
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired. Please login again." });
    }
    next(error);
  }
};


// ✅ Authorize — restrict access to specific roles
// Usage: authorize("admin")  or  authorize("admin", "user")
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. This action requires one of these roles: ${roles.join(", ")}.`,
    });
  }
  next();
};


// ✅ Admin-only shortcut middleware (use on all /api/admin/* routes)
const adminOnly = [protect, authorize("admin")];


module.exports = { protect, authorize, adminOnly };
