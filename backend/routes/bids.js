const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Bid = require("../models/Bid");
const Pickup = require("../models/Pickup");
const Notification = require("../models/Notification");

// Place a bid (Transporter only)
router.post("/:pickupId", auth, authorize("transporter", "collector"), async (req, res) => {
    try {
        const { price, message } = req.body;
        const bid = new Bid({
            pickupId: req.params.pickupId,
            transporterId: req.user.userId,
            price,
            message
        });
        await bid.save();

        // Notify Producer
        const pickup = await Pickup.findById(req.params.pickupId);
        if (pickup) {
            await Notification.create({
                userId: pickup.userId,
                message: `New bid of ₹${price} received for your ${pickup.wasteType} listing.`,
                type: 'bid',
                relatedId: bid._id
            });
        }

        res.status(201).json(bid);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get bids for a pickup (Producer only)
router.get("/:pickupId", auth, async (req, res) => {
    try {
        const bids = await Bid.find({ pickupId: req.params.pickupId }).populate("transporterId", "name rating");
        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Accept a bid (Producer only)
router.put("/:bidId/accept", auth, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId);
        if (!bid) return res.status(404).json({ message: "Bid not found" });

        // Update Bid status
        bid.status = "accepted";
        await bid.save();

        // Update Pickup status and assign transporter
        const pickup = await Pickup.findById(bid.pickupId);
        pickup.status = "accepted";
        pickup.transporterId = bid.transporterId;
        pickup.acceptedBid = bid._id;
        pickup.price = bid.price; // Update final price
        await pickup.save();

        // Reject other bids
        await Bid.updateMany(
            { pickupId: bid.pickupId, _id: { $ne: bid._id } },
            { status: "rejected" }
        );

        // Notify Transporter
        await Notification.create({
            userId: bid.transporterId,
            message: `Your bid for ${pickup.wasteType} has been accepted!`,
            type: 'status_update',
            relatedId: pickup._id
        });

        res.json({ message: "Bid accepted successfully", pickup });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
