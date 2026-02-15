const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const Offer = require('../models/Offer');

// GET all available waste listings for recyclers to browse
router.get('/listings', async (req, res) => {
    try {
        const { wasteType, quantity, location } = req.query;
        let query = { status: 'pending', buyerId: null };

        if (wasteType) query.wasteType = wasteType;
        if (quantity) query.estimatedWeight = { $gte: Number(quantity) };
        if (location) query.address = { $regex: location, $options: 'i' };

        const listings = await Pickup.find(query).populate('userId', 'name email phone');
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a purchase offer for a listing
router.post('/offer/:id', async (req, res) => {
    try {
        const { recyclerId, price, message } = req.body;
        const pickup = await Pickup.findById(req.params.id);

        if (!pickup) return res.status(404).json({ message: 'Listing not found' });
        if (pickup.buyerId) return res.status(400).json({ message: 'Listing already sold' });

        const offer = new Offer({
            pickupId: req.params.id,
            recyclerId,
            price: price || pickup.price,
            message
        });
        await offer.save();

        res.status(201).json({ message: 'Offer submitted successfully', offer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET incoming shipments for a specific recycler
router.get('/shipments/:recyclerId', async (req, res) => {
    try {
        const shipments = await Pickup.find({ buyerId: req.params.recyclerId })
            .populate('userId', 'name address')
            .populate('transporterId', 'name phone');
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH quality inspection and acceptance/rejection
router.patch('/inspect/:id', async (req, res) => {
    try {
        const { quality, notes, recyclerId } = req.body;
        const pickup = await Pickup.findById(req.params.id);

        if (!pickup) return res.status(404).json({ message: 'Shipment not found' });

        // Mark as delivered/completed if not already
        pickup.deliveryStatus = 'delivered';
        pickup.status = 'completed';
        await pickup.save();

        // Add to Inventory
        const inventoryItem = new Inventory({
            recyclerId,
            materialType: pickup.wasteType,
            quantity: pickup.estimatedWeight,
            sourcePickupId: pickup._id,
            quality: quality || 'Medium',
            notes
        });
        await inventoryItem.save();

        // Update Recycler total procured
        await User.findByIdAndUpdate(recyclerId, { $inc: { totalProcured: pickup.estimatedWeight } });

        res.json({ message: 'Quality inspection recorded and inventory updated', inventoryItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET inventory for a recycler
router.get('/inventory/:recyclerId', async (req, res) => {
    try {
        const inventory = await Inventory.find({ recyclerId: req.params.recyclerId });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET stats for dashboard
router.get('/stats/:recyclerId', async (req, res) => {
    try {
        const recyclerId = req.params.recyclerId;
        const shipments = await Pickup.countDocuments({ buyerId: recyclerId });
        const pendingShipments = await Pickup.countDocuments({ buyerId: recyclerId, deliveryStatus: { $ne: 'delivered' } });
        const inventory = await Inventory.find({ recyclerId });
        const totalMaterials = inventory.reduce((sum, item) => sum + item.quantity, 0);

        // Grouping for reports
        const materialGroups = await Inventory.aggregate([
            { $match: { recyclerId: new require('mongoose').Types.ObjectId(recyclerId) } },
            { $group: { _id: '$materialType', total: { $sum: '$quantity' } } }
        ]);

        res.json({
            shipments,
            pendingShipments,
            totalMaterials,
            materialGroups
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
