const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getMyLostItems,
    getMyFoundItems,
    getDashboardStats,
    getRecentActivity
} = require("../controllers/dashboardController");

router.get("/my-lost-items", protect, getMyLostItems);

router.get("/my-found-items", protect, getMyFoundItems);

router.get("/stats", protect, getDashboardStats);

router.get("/recent-activity", protect, getRecentActivity);

module.exports = router;