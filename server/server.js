const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Security Packages
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Database
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lostItemRoutes = require("./routes/lostItemRoutes");
const foundItemRoutes = require("./routes/foundItemRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const claimRequestRoutes = require("./routes/claimRequestRoutes");

// Error Middleware
const errorHandler = require("./middleware/errorMiddleware");

// Environment Variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// =======================================================
// Security Middleware
// =======================================================

// Security Headers
app.use(helmet());

// Compress Responses
app.use(compression());

// Logger
app.use(morgan("dev"));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// =======================================================
// Middleware
// =======================================================

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Static Upload Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================================================
// Home Route
// =======================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 Lost & Found API is running..."
    });
});

// =======================================================
// Health Check
// =======================================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

// =======================================================
// API Routes
// =======================================================

// Authentication
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);

// Lost Items
app.use("/api/lost-items", lostItemRoutes);

// Found Items
app.use("/api/found-items", foundItemRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Claim Requests
app.use("/api/claims", claimRequestRoutes);

// =======================================================
// 404 Handler
// =======================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// =======================================================
// Global Error Handler
// =======================================================

app.use(errorHandler);

// =======================================================
// Start Server
// =======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});