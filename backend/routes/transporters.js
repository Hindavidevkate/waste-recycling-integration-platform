const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Pickup = require('../models/Pickup');
const Bid = require('../models/Bid');
const DeliveryProof = require('../models/DeliveryProof');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Get all transporters (for assignment)
router.get('/', auth, async (req, res) => {
    try {
        const transporters = await User.find({ role: 'transporter' }).select('name email phone currentLocation vehicleType vehicleNumber rating completedJobs');
        res.json(transporters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Browse available pickup jobs (for bidding or accepting)
router.get('/jobs/available', auth, authorize('transporter'), async (req, res) => {
    try {
        const { wasteType, minPrice, maxPrice, minWeight, maxWeight } = req.query;

        let filter = {
            status: 'awaiting-transport',
            transporterId: { $exists: false } // Not yet assigned
        };

        // Apply filters
        if (wasteType) filter.wasteType = wasteType;
        if (minPrice) filter.price = { $gte: Number(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
        if (minWeight) filter.estimatedWeight = { $gte: Number(minWeight) };
        if (maxWeight) filter.estimatedWeight = { ...filter.estimatedWeight, $lte: Number(maxWeight) };

        const pickups = await Pickup.find(filter)
            .populate('userId', 'name phone address')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(pickups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get transporter's active jobs
router.get('/jobs/my-jobs', auth, authorize('transporter'), async (req, res) => {
    try {
        const pickups = await Pickup.find({
            transporterId: req.user.userId,
            status: { $in: ['accepted', 'awaiting-transport'] }
        })
            .populate('userId', 'name phone address')
            .sort({ date: 1 });

        res.json(pickups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get transporter's job history
router.get('/jobs/history', auth, authorize('transporter'), async (req, res) => {
    try {
        const pickups = await Pickup.find({
            transporterId: req.user.userId,
            status: { $in: ['completed', 'cancelled'] }
        })
            .populate('userId', 'name phone address')
            .sort({ updatedAt: -1 });

        res.json(pickups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Accept a fixed-price job (no bidding)
router.post('/jobs/:id/accept', auth, authorize('transporter'), async (req, res) => {
    try {
        const pickup = await Pickup.findById(req.params.id);
        if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

        if (pickup.transporterId) {
            return res.status(400).json({ message: 'Job already assigned' });
        }

        pickup.transporterId = req.user.userId;
        pickup.status = 'accepted';
        pickup.deliveryStatus = 'pending';
        await pickup.save();

        // Notify producer
        await Notification.create({
            userId: pickup.userId,
            message: `Your pickup for ${pickup.wasteType} has been accepted by a transporter!`,
            type: 'status_update',
            relatedId: pickup._id
        });

        // Update transporter stats
        await User.findByIdAndUpdate(req.user.userId, {
            $inc: { totalJobs: 1 }
        });

        res.json({ message: 'Job accepted successfully', pickup });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update delivery status
router.put('/jobs/:id/status', auth, authorize('transporter'), async (req, res) => {
    try {
        const { deliveryStatus } = req.body;
        const pickup = await Pickup.findById(req.params.id);

        if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
        if (pickup.transporterId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        pickup.deliveryStatus = deliveryStatus;

        // Set timestamps based on status
        if (deliveryStatus === 'picked-up' && !pickup.pickupTime) {
            pickup.pickupTime = new Date();
        }
        if (deliveryStatus === 'delivered' && !pickup.deliveryTime) {
            pickup.deliveryTime = new Date();
            pickup.status = 'completed';

            // Update transporter completion stats
            await User.findByIdAndUpdate(req.user.userId, {
                $inc: { completedJobs: 1 }
            });
        }

        await pickup.save();

        // Notify producer of status change
        const statusMessages = {
            'picked-up': `Your ${pickup.wasteType} waste has been picked up!`,
            'in-transit': `Your ${pickup.wasteType} is in transit`,
            'delivered': `Your ${pickup.wasteType} has been delivered successfully!`
        };

        if (statusMessages[deliveryStatus]) {
            await Notification.create({
                userId: pickup.userId,
                message: statusMessages[deliveryStatus],
                type: 'status_update',
                relatedId: pickup._id
            });
        }

        res.json({ message: 'Status updated successfully', pickup });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload delivery proof
router.post('/delivery-proof', auth, authorize('transporter'), async (req, res) => {
    try {
        const { pickupId, photos, signature, notes, weight, location } = req.body;

        const pickup = await Pickup.findById(pickupId);
        if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
        if (pickup.transporterId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const deliveryProof = new DeliveryProof({
            pickupId,
            transporterId: req.user.userId,
            photos,
            signature,
            notes,
            weight,
            location
        });

        await deliveryProof.save();

        pickup.deliveryProofId = deliveryProof._id;
        pickup.deliveryStatus = 'delivered';
        pickup.status = 'completed';
        pickup.deliveryTime = new Date();
        await pickup.save();

        // Notify producer
        await Notification.create({
            userId: pickup.userId,
            message: `Delivery proof uploaded for your ${pickup.wasteType} pickup`,
            type: 'status_update',
            relatedId: pickupId
        });

        res.status(201).json({ message: 'Delivery proof uploaded successfully', deliveryProof });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get earnings statistics
router.get('/earnings', auth, authorize('transporter'), async (req, res) => {
    try {
        const pickups = await Pickup.find({
            transporterId: req.user.userId,
            status: 'completed'
        });

        const totalEarnings = pickups.reduce((sum, p) => sum + (p.price || 0), 0);
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const monthlyPickups = pickups.filter(p => new Date(p.updatedAt) >= thisMonth);
        const monthlyEarnings = monthlyPickups.reduce((sum, p) => sum + (p.price || 0), 0);

        const user = await User.findById(req.user.userId);

        res.json({
            totalEarnings,
            monthlyEarnings,
            completedJobs: user.completedJobs || 0,
            totalJobs: user.totalJobs || 0,
            rating: user.rating || 0,
            recentJobs: pickups.slice(0, 5)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get payment history
router.get('/payments', auth, authorize('transporter'), async (req, res) => {
    try {
        const pickups = await Pickup.find({
            transporterId: req.user.userId,
            paymentStatus: 'completed'
        })
            .populate('userId', 'name')
            .sort({ paymentDate: -1 });

        res.json(pickups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update current location
router.put('/location', auth, authorize('transporter'), async (req, res) => {
    try {
        const { lat, lng, address } = req.body;

        await User.findByIdAndUpdate(req.user.userId, {
            currentLocation: { lat, lng, address }
        });

        res.json({ message: 'Location updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
