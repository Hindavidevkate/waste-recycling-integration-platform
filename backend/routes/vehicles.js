const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

// Add new vehicle
router.post('/', auth, authorize('transporter'), async (req, res) => {
    try {
        const { vehicleType, vehicleNumber, capacity, insurance, fuelType, mileage } = req.body;

        // Check if vehicle number already exists
        const existing = await Vehicle.findOne({ vehicleNumber });
        if (existing) {
            return res.status(400).json({ message: 'Vehicle number already registered' });
        }

        const vehicle = new Vehicle({
            transporterId: req.user.userId,
            vehicleType,
            vehicleNumber,
            capacity,
            insurance,
            fuelType,
            mileage
        });

        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all vehicles for logged-in transporter
router.get('/', auth, authorize('transporter'), async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ transporterId: req.user.userId });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update vehicle details
router.put('/:id', auth, authorize('transporter'), async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (vehicle.transporterId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updated = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete vehicle
router.delete('/:id', auth, authorize('transporter'), async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (vehicle.transporterId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update vehicle status
router.put('/:id/status', auth, authorize('transporter'), async (req, res) => {
    try {
        const { status } = req.body;
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        if (vehicle.transporterId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        vehicle.status = status;
        await vehicle.save();

        res.json({ message: 'Vehicle status updated', vehicle });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
