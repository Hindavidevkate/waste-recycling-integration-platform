// backend/models/Pickup.js
const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  wasteType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  estimatedWeight: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'sold', 'awaiting-transport', 'completed', 'cancelled'],
    default: 'pending'
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Transporter/Bidding fields
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  // Delivery tracking fields
  deliveryStatus: {
    type: String,
    enum: ['pending', 'picked-up', 'in-transit', 'delivered', 'failed'],
    default: 'pending'
  },
  pickupTime: {
    type: Date
  },
  deliveryTime: {
    type: Date
  },
  deliveryProofId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryProof'
  },
  // Payment tracking
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number
  },
  paymentDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', pickupSchema);