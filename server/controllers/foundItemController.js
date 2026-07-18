const FoundItem = require("../models/FoundItem");

// Create Found Item
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

// Get All Found Items
const getAllFoundItems = async (req, res) => {

    try {

        const items = await FoundItem.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

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

module.exports = {
    createFoundItem,
    getAllFoundItems
};