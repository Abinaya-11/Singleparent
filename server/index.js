// server/index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path"); // for safe absolute paths

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// =============================
// Middleware
// =============================

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Enable CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);

// =============================
// Import Routes
// =============================

// Auth routes (register, login)
const authRoutes = require(path.join(__dirname, "routes", "auth"));

// User routes (protected, e.g., profile)
const userRoutes = require(path.join(__dirname, "routes", "user"));

// =============================
// Mount Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// =============================
// MongoDB Connection
// =============================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use("/uploads", express.static("uploads"));

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);