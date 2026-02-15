const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Report = require("../models/Report");
const Pickup = require("../models/Pickup");
const User = require("../models/User");

// Generate Dashboard Report (Admin only)
router.get("/dashboard-stats", auth, authorize("admin"), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPickups = await Pickup.countDocuments();
        const pendingPickups = await Pickup.countDocuments({ status: "pending" });
        const recycledWaste = await Pickup.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, totalWeight: { $sum: "$estimatedWeight" } } }
        ]);

        const stats = {
            totalUsers,
            totalPickups,
            pendingPickups,
            totalRecycledWeight: recycledWaste[0]?.totalWeight || 0
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user growth stats (Admin only)
router.get("/user-growth", auth, authorize("admin"), async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
