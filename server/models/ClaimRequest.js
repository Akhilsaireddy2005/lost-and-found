const mongoose = require("mongoose");

const claimRequestSchema = new mongoose.Schema(
{
    lostItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LostItem",
        required: true
    },

    foundItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoundItem",
        required: true
    },

    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    message: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Rejected"
        ],
        default: "Pending"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model(
    "ClaimRequest",
    claimRequestSchema
);