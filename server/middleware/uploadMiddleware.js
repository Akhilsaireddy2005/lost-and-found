const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use absolute path to ensure accuracy regardless of where server started
        cb(null, path.join(__dirname, "..", "uploads"));
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/i;
    
    // Check extension
    const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const isMimeValid = allowedTypes.test(file.mimetype);

    if (isExtValid || isMimeValid) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max limit
});

module.exports = upload;