const LostItem = require("../models/LostItem");

// ==========================
// Create Lost Item
// ==========================
const createLostItem = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            dateLost
        } = req.body;

        const image = req.file
            ? `/uploads/${req.file.filename}`
            : "";

        if (!title || !description || !category || !location || !dateLost) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const lostItem = await LostItem.create({
            title,
            description,
            category,
            location,
            dateLost,
            image,
            owner: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Lost item created successfully.",
            lostItem
        });

    } catch (error) {
        console.error("Create Lost Item Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==========================
// Get All Lost Items
// Search + Filter + Sort + Pagination
// ==========================
const getAllLostItems = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const query = {};

        // Search by title
        if (req.query.search) {
            query.title = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by location
        if (req.query.location) {
            query.location = {
                $regex: req.query.location,
                $options: "i"
            };
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Sorting
        let sortOption = { createdAt: -1 };

        if (req.query.sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        if (req.query.sort === "title") {
            sortOption = { title: 1 };
        }

        const totalItems = await LostItem.countDocuments(query);

        const lostItems = await LostItem.find(query)
            .populate("owner", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            count: lostItems.length,
            lostItems
        });

    } catch (error) {

        console.error("Get All Lost Items Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ==========================
// Get Single Lost Item
// ==========================
const getLostItemById = async (req, res) => {
    try {

        const lostItem = await LostItem.findById(req.params.id)
            .populate("owner", "name email");

        if (!lostItem) {
            return res.status(404).json({
                success: false,
                message: "Lost item not found."
            });
        }

        return res.status(200).json({
            success: true,
            lostItem
        });

    } catch (error) {

        console.error("Get Lost Item Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ==========================
// Update Lost Item
// ==========================
const updateLostItem = async (req, res) => {
    try {

        const lostItem = await LostItem.findById(req.params.id);

        if (!lostItem) {
            return res.status(404).json({
                success: false,
                message: "Lost item not found."
            });
        }

        if (lostItem.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized."
            });
        }

        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await LostItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Lost item updated successfully.",
            lostItem: updatedItem
        });

    } catch (error) {

        console.error("Update Lost Item Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ==========================
// Delete Lost Item
// ==========================
const deleteLostItem = async (req, res) => {
    try {

        const lostItem = await LostItem.findById(req.params.id);

        if (!lostItem) {
            return res.status(404).json({
                success: false,
                message: "Lost item not found."
            });
        }

        if (lostItem.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized."
            });
        }

        await lostItem.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Lost item deleted successfully."
        });

    } catch (error) {

        console.error("Delete Lost Item Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    createLostItem,
    getAllLostItems,
    getLostItemById,
    updateLostItem,
    deleteLostItem
};