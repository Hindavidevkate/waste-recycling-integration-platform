const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Complaint = require("../models/Complaint");

// Describe complaint (User)
router.post("/", auth, async (req, res) => {
    try {
        const { subject, description } = req.body;
        const complaint = new Complaint({
            userId: req.user.userId,
            subject,
            description
        });
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get complaints (Admin sees all, User sees own)
router.get("/", auth, async (req, res) => {
    try {
        let complaints;
        if (req.user.role === "admin") {
            complaints = await Complaint.find().populate("userId", "name email");
        } else {
            complaints = await Complaint.find({ userId: req.user.userId });
        }
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Resolve complaint (Admin only)
router.put("/:id/resolve", auth, authorize("admin"), async (req, res) => {
    try {
        const { status, adminResponse } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status, adminResponse, resolvedAt: Date.now() },
            { new: true }
        );
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
