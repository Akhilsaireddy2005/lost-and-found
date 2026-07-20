const ClaimRequest = require("../models/ClaimRequest");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");

// ======================================
// Create Claim Request
// ======================================
const createClaimRequest = async (req, res) => {
    try {

        const {
            lostItemId,
            foundItemId,
            message
        } = req.body;

        if (!lostItemId || !foundItemId) {
            return res.status(400).json({
                success: false,
                message: "Lost Item and Found Item are required."
            });
        }

        const lostItem = await LostItem.findById(lostItemId);

        if (!lostItem) {
            return res.status(404).json({
                success: false,
                message: "Lost item not found."
            });
        }

        const foundItem = await FoundItem.findById(foundItemId);

        if (!foundItem) {
            return res.status(404).json({
                success: false,
                message: "Found item not found."
            });
        }

        if (lostItem.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner of the lost item can send a claim request."
            });
        }

        if (foundItem.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot claim your own found item."
            });
        }

        const existingRequest = await ClaimRequest.findOne({
            lostItem: lostItemId,
            foundItem: foundItemId,
            requester: req.user._id
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "Claim request already exists."
            });
        }

        const claim = await ClaimRequest.create({
            lostItem: lostItemId,
            foundItem: foundItemId,
            requester: req.user._id,
            receiver: foundItem.owner,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Claim request sent successfully.",
            claim
        });

    } catch (error) {

        console.error("Create Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ======================================
// My Sent Requests
// ======================================
const getMyRequests = async (req, res) => {

    try {

        const requests = await ClaimRequest.find({
            requester: req.user._id
        })
        .populate("lostItem")
        .populate("foundItem")
        .populate("receiver", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {

        console.error("Get My Requests Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ======================================
// Received Requests
// ======================================
const getReceivedRequests = async (req, res) => {

    try {

        const requests = await ClaimRequest.find({
            receiver: req.user._id
        })
        .populate("lostItem")
        .populate("foundItem")
        .populate("requester", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {

        console.error("Get Received Requests Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ======================================
// Accept Claim Request
// ======================================
const acceptClaimRequest = async (req, res) => {

    try {

        const claim = await ClaimRequest.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim request not found."
            });
        }

        if (claim.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized."
            });
        }

        if (claim.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: `Claim request is already ${claim.status}.`
            });
        }

        claim.status = "Accepted";
        await claim.save();

        await LostItem.findByIdAndUpdate(
            claim.lostItem,
            {
                status: "Found"
            }
        );

        await FoundItem.findByIdAndUpdate(
            claim.foundItem,
            {
                status: "Claimed"
            }
        );

        await ClaimRequest.updateMany(
            {
                _id: { $ne: claim._id },
                foundItem: claim.foundItem,
                status: "Pending"
            },
            {
                status: "Rejected"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Claim request accepted successfully.",
            claim
        });

    } catch (error) {

        console.error("Accept Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ======================================
// Reject Claim Request
// ======================================
const rejectClaimRequest = async (req, res) => {

    try {

        const claim = await ClaimRequest.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim request not found."
            });
        }

        if (claim.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized."
            });
        }

        if (claim.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: `Claim request is already ${claim.status}.`
            });
        }

        claim.status = "Rejected";

        await claim.save();

        return res.status(200).json({
            success: true,
            message: "Claim request rejected successfully.",
            claim
        });

    } catch (error) {

        console.error("Reject Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ======================================
// Delete Claim Request
// ======================================
const deleteClaimRequest = async (req, res) => {

    try {

        const claim = await ClaimRequest.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim request not found."
            });
        }

        if (claim.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized."
            });
        }

        if (claim.status === "Accepted") {
            return res.status(400).json({
                success: false,
                message: "Accepted claim requests cannot be deleted."
            });
        }

        await claim.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Claim request deleted successfully."
        });

    } catch (error) {

        console.error("Delete Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    createClaimRequest,
    getMyRequests,
    getReceivedRequests,
    acceptClaimRequest,
    rejectClaimRequest,
    deleteClaimRequest
};