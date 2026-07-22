const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const ClaimRequest = require("../models/ClaimRequest");

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

        const [totalLost, totalFound, resolvedLost, resolvedFound, pendingClaims, acceptedClaims] = await Promise.all([
            LostItem.countDocuments({ owner: req.user._id }),
            FoundItem.countDocuments({ owner: req.user._id }),
            LostItem.countDocuments({ owner: req.user._id, status: "Found" }),
            FoundItem.countDocuments({ owner: req.user._id, status: "Claimed" }),
            ClaimRequest.countDocuments({
                $or: [{ requester: req.user._id }, { receiver: req.user._id }],
                status: "Pending"
            }),
            ClaimRequest.countDocuments({
                $or: [{ requester: req.user._id }, { receiver: req.user._id }],
                status: "Accepted"
            })
        ]);

        res.status(200).json({
            success: true,
            lostItems: totalLost,
            foundItems: totalFound,
            pendingClaims,
            acceptedClaims
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

        const [lostItems, foundItems, claims] = await Promise.all([
            LostItem.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(5),
            FoundItem.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(5),
            ClaimRequest.find({
                $or: [{ requester: req.user._id }, { receiver: req.user._id }]
            })
            .populate("lostItem", "title")
            .populate("foundItem", "title")
            .sort({ createdAt: -1 })
            .limit(5)
        ]);

        const activity = [
            ...lostItems.map(item => ({
                type: "Lost",
                title: item.title,
                status: item.status,
                createdAt: item.createdAt,
                _id: item._id
            })),
            ...foundItems.map(item => ({
                type: "Found",
                title: item.title,
                status: item.status,
                createdAt: item.createdAt,
                _id: item._id
            })),
            ...claims.map(claim => ({
                type: "Claim",
                title: claim.lostItem?.title || "Unknown Item",
                status: claim.status,
                createdAt: claim.createdAt,
                _id: claim._id
            }))
        ];

        activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            success: true,
            activities: activity.slice(0, 10)
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