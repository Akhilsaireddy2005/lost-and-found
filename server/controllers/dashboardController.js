const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");

// ==========================
// My Lost Items
// ==========================
const getMyLostItems = async (req, res) => {
    try {

        const items = await LostItem.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            lostItems: items
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ==========================
// My Found Items
// ==========================
const getMyFoundItems = async (req, res) => {

    try {

        const items = await FoundItem.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            foundItems: items
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ==========================
// Dashboard Statistics
// ==========================
const getDashboardStats = async (req, res) => {

    try {

        const totalLost = await LostItem.countDocuments({
            owner: req.user._id
        });

        const totalFound = await FoundItem.countDocuments({
            owner: req.user._id
        });

        const resolvedLost = await LostItem.countDocuments({
            owner: req.user._id,
            status: "Found"
        });

        const resolvedFound = await FoundItem.countDocuments({
            owner: req.user._id,
            status: "Claimed"
        });

        res.status(200).json({
            success: true,
            stats: {
                totalLost,
                totalFound,
                resolvedLost,
                resolvedFound
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ==========================
// Recent Activity
// ==========================
const getRecentActivity = async (req, res) => {

    try {

        const lostItems = await LostItem.find({
            owner: req.user._id
        });

        const foundItems = await FoundItem.find({
            owner: req.user._id
        });

        const activity = [
            ...lostItems.map(item => ({
                type: "Lost",
                title: item.title,
                createdAt: item.createdAt
            })),
            ...foundItems.map(item => ({
                type: "Found",
                title: item.title,
                createdAt: item.createdAt
            }))
        ];

        activity.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            success: true,
            recentActivity: activity.slice(0, 10)
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getMyLostItems,
    getMyFoundItems,
    getDashboardStats,
    getRecentActivity
};