require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorMiddleware = require("./middlewares/error.middleware");

// Connect to MongoDB
connectDB();

const app = express();
// ─── Security & Utility Middleware ───────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin.startsWith("http://localhost:") || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ─── Health Check Route ───────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Luxury Interiors API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const authRoutes        = require("./routes/auth.routes");
const heroRoutes        = require("./routes/heroSection.routes");
const settingRoutes     = require("./routes/siteSetting.routes");
const collectionRoutes  = require("./routes/collection.routes");
const projectRoutes     = require("./routes/project.routes");
const offerRoutes       = require("./routes/offer.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const enquiryRoutes     = require("./routes/enquiry.routes");
const categoryRoutes    = require("./routes/category.routes");
const productRoutes     = require("./routes/product.routes");
const cartRoutes        = require("./routes/cart.routes");
const orderRoutes       = require("./routes/order.routes");
const paymentRoutes     = require("./routes/payment.routes");
const uploadRoutes      = require("./routes/upload.routes");
const subcategoryRoutes = require("./routes/subcategory.routes");
const subcategoryItemRoutes = require("./routes/subcategoryItem.routes");

app.use("/api/auth",          authRoutes);
app.use("/api/hero-sections", heroRoutes);
app.use("/api/site-settings", settingRoutes);
app.use("/api/collections",   collectionRoutes);
app.use("/api/projects",      projectRoutes);
app.use("/api/offers",        offerRoutes);
app.use("/api/testimonials",  testimonialRoutes);
app.use("/api/enquiries",     enquiryRoutes);
app.use("/api/categories",    categoryRoutes);
app.use("/api/products",      productRoutes);
app.use("/api/cart",          cartRoutes);
app.use("/api/orders",        orderRoutes);
app.use("/api/payments",      paymentRoutes);
app.use("/api/upload",        uploadRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/subcategory-items", subcategoryItemRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

server.timeout = 600000; // 10 minutes timeout for large zip uploads

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
  

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});