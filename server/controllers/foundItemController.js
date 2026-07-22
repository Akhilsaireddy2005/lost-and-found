const FoundItem = require("../models/FoundItem");
const fs = require("fs");
const path = require("path");

// ==========================
// Helper: Delete image file
// ==========================
const deleteImageFile = (imagePath) => {
    if (!imagePath) return;
    const fullPath = path.join(__dirname, "..", imagePath);
    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
            if (err) console.error("Image delete error:", err);
        });
    }
};

// ==========================
// Create Found Item
// ==========================
const createFoundItem = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            dateFound
        } = req.body;

        const image = req.file
            ? `/uploads/${req.file.filename}`
            : "";

        if (!title || !description || !category || !location || !dateFound) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const foundItem = await FoundItem.create({
            title,
            description,
            category,
            location,
            dateFound,
            image,
            owner: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Found item created successfully.",
            foundItem
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
// Get All Found Items
// ==========================
const getAllFoundItems = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const query = {};

        if (req.query.search) {
            query.title = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.location) {
            query.location = {
                $regex: req.query.location,
                $options: "i"
            };
        }

        if (req.query.status) {
            query.status = req.query.status;
        }

        let sortOption = { createdAt: -1 };

        if (req.query.sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        if (req.query.sort === "title") {
            sortOption = { title: 1 };
        }

        const totalItems = await FoundItem.countDocuments(query);

        const foundItems = await FoundItem.find(query)
            .populate("owner", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            count: foundItems.length,
            foundItems
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
// Get Single Found Item
// ==========================
const getFoundItemById = async (req, res) => {

    try {

        const foundItem = await FoundItem.findById(req.params.id)
            .populate("owner", "name email");

        if (!foundItem) {
            return res.status(404).json({
                success: false,
                message: "Found item not found."
            });
        }

        res.status(200).json({
            success: true,
            foundItem
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
// Update Found Item
// ==========================
const updateFoundItem = async (req, res) => {

    try {

        const foundItem = await FoundItem.findById(req.params.id);

        if (!foundItem) {
            return res.status(404).json({
                success: false,
                message: "Found item not found."
            });
        }

        if (foundItem.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized."
            });
        }

        // Delete old image if new one uploaded
        if (req.file) {
            deleteImageFile(foundItem.image);
            req.body.image = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await FoundItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Found item updated successfully.",
            foundItem: updatedItem
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
// Delete Found Item
// ==========================
const deleteFoundItem = async (req, res) => {

    try {

        const foundItem = await FoundItem.findById(req.params.id);

        if (!foundItem) {
            return res.status(404).json({
                success: false,
                message: "Found item not found."
            });
        }

        if (foundItem.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized."
            });
        }

        // Delete associated image from disk
        deleteImageFile(foundItem.image);

        await foundItem.deleteOne();

        res.status(200).json({
            success: true,
            message: "Found item deleted successfully."
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
    createFoundItem,
    getAllFoundItems,
    getFoundItemById,
    updateFoundItem,
    deleteFoundItem
};