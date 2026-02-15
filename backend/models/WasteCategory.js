const mongoose = require("mongoose");

const wasteCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    pricePerKg: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        default: "kg"
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("WasteCategory", wasteCategorySchema);
