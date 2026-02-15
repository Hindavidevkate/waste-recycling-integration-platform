const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["producer", "buyer", "transporter", "admin", "collector", "recycler"],
    required: true
  },
  phone: { type: String },
  address: { type: String },

  // Producer/Business specific fields
  businessName: { type: String },
  gstin: { type: String },
  wasteGenerationCapacity: { type: Number }, // in kg/month
  businessType: { type: String }, // e.g., 'Restaurant', 'Factory', 'Individual'

  // Transporter specific fields
  vehicleType: { type: String }, // 'Truck', 'Van', 'Pickup', etc.
  vehicleNumber: { type: String },
  licenseNumber: { type: String },
  licenseExpiry: { type: Date },
  capacity: { type: Number }, // Vehicle capacity in kg
  availability: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  rating: { type: Number, default: 0 }, // Average rating
  totalJobs: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },

  // Recycler specific fields
  acceptedWasteTypes: [{ type: String }],
  facilityType: { type: String }, // e.g., 'Processing Plant', 'Collection Center'
  recyclingCertificates: [{
    name: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    fileUrl: { type: String }
  }],
  totalProcured: { type: Number, default: 0 }, // in kg

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);