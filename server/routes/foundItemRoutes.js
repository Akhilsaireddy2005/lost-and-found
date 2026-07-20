const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
    createFoundItem,
    getAllFoundItems,
    getFoundItemById,
    updateFoundItem,
    deleteFoundItem
} = require("../controllers/foundItemController");

// Public
router.get("/", getAllFoundItems);
router.get("/:id", getFoundItemById);

// Protected
router.post("/", protect, upload.single("image"), createFoundItem);

router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateFoundItem
);

router.delete("/:id", protect, deleteFoundItem);

module.exports = router;