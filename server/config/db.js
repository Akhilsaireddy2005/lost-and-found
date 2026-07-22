const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI or MONGO_URI environment variable is missing.");
        }
        const conn = await mongoose.connect(mongoUri);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;