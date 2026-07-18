const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        dateFound: {
            type: Date,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Found", "Claimed"],
            default: "Found"
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);