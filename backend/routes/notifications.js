const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const Notification = require("../models/Notification");

// Get my notifications
router.get("/", auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark as read
router.put("/:id/read", auth, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark ALL as read
router.put("/read-all", auth, async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.userId }, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
