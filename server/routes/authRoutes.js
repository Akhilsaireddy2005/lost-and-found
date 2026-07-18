const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
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

module.exports = router;