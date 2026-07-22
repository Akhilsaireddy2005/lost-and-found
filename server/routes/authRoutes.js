const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/authController");

// ==========================
// Test Route
// ==========================
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authentication Route Working"
    });
});

// ==========================
// Register Route
// POST /api/auth/register
// ==========================
router.post("/register", registerUser);

// ==========================
// Login Route
// POST /api/auth/login
// ==========================
router.post("/login", loginUser);

// ==========================
// Get Profile
// GET /api/auth/profile
// ==========================
router.get("/profile", protect, getProfile);

// ==========================
// Update Profile
// PUT /api/auth/profile
// ==========================
router.put("/profile", protect, upload.single("avatar"), updateProfile);

// ==========================
// Change Password
// PUT /api/auth/change-password
// ==========================
router.put("/change-password", protect, changePassword);

module.exports = router;