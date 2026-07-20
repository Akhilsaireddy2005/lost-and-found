const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createClaimRequest,
    getMyRequests,
    getReceivedRequests,
    acceptClaimRequest,
    rejectClaimRequest,
    deleteClaimRequest
} = require("../controllers/claimRequestController");

// ======================================
// Create Claim Request
// POST /api/claims
// ======================================
router.post("/", protect, createClaimRequest);

// ======================================
// Get My Sent Requests
// GET /api/claims/my-requests
// ======================================
router.get("/my-requests", protect, getMyRequests);

// ======================================
// Get Received Requests
// GET /api/claims/received
// ======================================
router.get("/received", protect, getReceivedRequests);

// ======================================
// Accept Claim Request
// PUT /api/claims/:id/accept
// ======================================
router.put("/:id/accept", protect, acceptClaimRequest);

// ======================================
// Reject Claim Request
// PUT /api/claims/:id/reject
// ======================================
router.put("/:id/reject", protect, rejectClaimRequest);

// ======================================
// Delete Claim Request
// DELETE /api/claims/:id
// ======================================
router.delete("/:id", protect, deleteClaimRequest);

module.exports = router;