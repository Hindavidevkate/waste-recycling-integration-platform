const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleType: {
        type: String,
        required: true // 'Truck', 'Van', 'Pickup', 'Mini Truck', etc.
    },
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true // in kg
    },
    status: {
        type: String,
        enum: ['available', 'in-use', 'maintenance', 'inactive'],
        default: 'available'
    },
    insurance: {
        number: { type: String },
        expiry: { type: Date }
    },
    documents: [{
        type: String // File paths
    }],
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
    },
    mileage: {
        type: Number // km/liter or km/charge
    },
    lastServiceDate: {
        type: Date
    },
    nextServiceDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
