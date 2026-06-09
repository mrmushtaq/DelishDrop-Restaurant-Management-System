const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();


// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  // deployed frontend
  "https://delish-drop-restaurant-management-by-mushtaq.vercel.app",

  // deployed backend (optional)
  "https://delish-drop-restaurant-management-by-mushtaque.vercel.app",

  // localhost development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",

  // Vercel ENV
  process.env.CLIENT_URL,

].filter(Boolean);


app.use(
  cors({
    origin: function (origin, callback) {

      // allow postman/mobile apps
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(
        new Error("CORS policy: Origin not allowed")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ===============================
// MIDDLEWARES
// ===============================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ===============================
// RATE LIMIT
// ===============================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 200,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again later.",
  },
});


app.use("/api", apiLimiter);


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "DelishDrop API is running 🚀",
  });

});


// ===============================
// API ROUTES
// ===============================


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/foods",
  foodRoutes
);


app.use(
  "/api/categories",
  categoryRoutes
);


app.use(
  "/api/orders",
  orderRoutes
);


app.use(
  "/api/delivery",
  deliveryRoutes
);


app.use(
  "/api/admin",
  adminRoutes
);


app.use(
  "/api/favourites",
  favouriteRoutes
);


// ===============================
// 404 ROUTE
// ===============================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message:
      `Route ${req.originalUrl} not found`,
  });

});


// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);


module.exports = app;