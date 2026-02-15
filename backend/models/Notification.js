const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String, // e.g., 'bid', 'status_update', 'system'
        default: 'system'
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId // e.g., Pickup ID or Bid ID
    }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
