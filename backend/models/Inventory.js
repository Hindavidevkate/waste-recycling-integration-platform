const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    recyclerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    materialType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number, // in kg
        required: true,
        default: 0
    },
    sourcePickupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pickup'
    },
    receivedDate: {
        type: Date,
        default: Date.now
    },
    quality: {
        type: String,
        enum: ['High', 'Medium', 'Low', 'Pending'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['In Stock', 'Processed', 'Sold'],
        default: 'In Stock'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
