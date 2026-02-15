const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
    pickupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pickup",
        required: true
    },
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Bid", bidSchema);
