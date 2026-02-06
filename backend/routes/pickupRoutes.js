const express = require("express");
const router = express.Router();
const Pickup = require("../models/Pickup");

// Create Pickup Request
router.post("/", async (req, res) => {
  try {
    const newPickup = new Pickup(req.body);
    await newPickup.save();
    res.status(201).json(newPickup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Pickup Requests
router.get("/", async (req, res) => {
  try {
    const pickups = await Pickup.find();
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
