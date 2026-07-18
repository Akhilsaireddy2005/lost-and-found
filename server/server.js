const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");
const foundItemRoutes = require("./routes/foundItemRoutes");
// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lostItemRoutes = require("./routes/lostItemRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ==========================
// Middleware
// ==========================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Serve Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// Home Route
// ==========================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 Lost & Found API is running..."
    });
});

// ==========================
// API Routes
// ==========================

// Authentication Routes
app.use("/api/auth", authRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Lost Item Routes
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);

// ==========================
// 404 Route
// ==========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});