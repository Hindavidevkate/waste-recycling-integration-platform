const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["daily", "weekly", "monthly", "custom"],
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    dateRange: {
        start: Date,
        end: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
