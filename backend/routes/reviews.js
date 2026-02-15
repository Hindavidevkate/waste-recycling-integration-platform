const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const Review = require("../models/Review");
const Pickup = require("../models/Pickup");
const User = require("../models/User");

// Add a review (Producer -> Transporter)
router.post("/", auth, async (req, res) => {
    try {
        const { pickupId, rating, comment } = req.body;

        // Validate Pickup
        const pickup = await Pickup.findById(pickupId);
        if (!pickup) return res.status(404).json({ message: "Pickup not found" });

        // Check if user owns pickup and it is completed
        if (pickup.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }
        if (pickup.status !== "completed") {
            return res.status(400).json({ message: "Pickup must be completed to review" });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ pickupId });
        if (existingReview) {
            return res.status(400).json({ message: "Review already submitted" });
        }

        const review = new Review({
            reviewerId: req.user.userId,
            targetId: pickup.transporterId,
            pickupId,
            rating,
            comment
        });
        await review.save();

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get reviews for a transporter
router.get("/transporter/:id", async (req, res) => {
    try {
        const reviews = await Review.find({ targetId: req.params.id }).populate("reviewerId", "name");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
