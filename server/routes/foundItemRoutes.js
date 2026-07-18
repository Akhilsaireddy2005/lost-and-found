const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
    createFoundItem,
    getAllFoundItems
} = require("../controllers/foundItemController");

// Public
router.get("/", getAllFoundItems);

// Protected
router.post(
    "/",
    protect,
    upload.single("image"),
    createFoundItem
);

module.exports = router;