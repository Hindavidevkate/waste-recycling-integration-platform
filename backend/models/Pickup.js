const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
  name: String,
  address: String,
  wasteType: String,
  date: String,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Pickup", pickupSchema);
