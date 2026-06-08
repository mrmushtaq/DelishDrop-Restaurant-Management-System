const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes       = require("./routes/authRoutes");
const foodRoutes       = require("./routes/foodRoutes");
const categoryRoutes   = require("./routes/categoryRoutes");
const orderRoutes      = require("./routes/orderRoutes");
const deliveryRoutes   = require("./routes/deliveryRoutes");
const adminRoutes      = require("./routes/adminRoutes");
const favouriteRoutes  = require("./routes/favouriteRoutes"); // ✅ NEW
const errorHandler     = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("CORS policy: Origin not allowed."));
  },
  credentials: true,
}));
app.use("/api", apiLimiter);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "DelishDrop API is running 🚀" });
});

// Routes
app.use("/api/auth",        authRoutes);
app.use("/api/foods",       foodRoutes);
app.use("/api/categories",  categoryRoutes);
app.use("/api/orders",      orderRoutes);
app.use("/api/delivery",    deliveryRoutes);
app.use("/api/admin",       adminRoutes);
app.use("/api/favourites",  favouriteRoutes); // ✅ NEW

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;