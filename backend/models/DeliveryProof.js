const mongoose = require('mongoose');

const deliveryProofSchema = new mongoose.Schema({
    pickupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pickup',
        required: true
    },
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photos: [{
        type: String // File paths to uploaded images
    }],
    signature: {
        type: String // Data URL or file path for signature
    },
    notes: {
        type: String,
        default: ''
    },
    weight: {
        type: Number // Actual weight collected in kg
    },
    location: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryProof', deliveryProofSchema);
