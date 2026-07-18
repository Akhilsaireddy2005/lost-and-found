const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
    createLostItem,
    getAllLostItems,
    getLostItemById,
    updateLostItem,
    deleteLostItem
} = require("../controllers/lostItemController");

// Public Routes
router.get("/", getAllLostItems);
router.get("/:id", getLostItemById);

// Protected Routes
router.post("/", protect, upload.single("image"), createLostItem);

router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateLostItem
);

router.delete("/:id", protect, deleteLostItem);

module.exports = router;