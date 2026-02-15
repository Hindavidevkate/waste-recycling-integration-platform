// backend/routes/temp.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Pickup = require('../models/Pickup');
const Offer = require('../models/Offer');
const { auth } = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/waste-images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Create pickup with images
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, address, wasteType, date, description, estimatedWeight, price } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/waste-images/${file.filename}`) : [];

    const pickup = new Pickup({
      userId: req.user.userId,
      name,
      address,
      wasteType,
      date,
      description,
      estimatedWeight,
      price,
      images,
      status: 'pending'
    });

    await pickup.save();
    res.status(201).json(pickup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all pickups (for buyers to browse)
router.get('/marketplace', auth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my pickups (for producers)
router.get('/', auth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get offers for a pickup (for producers)
router.get('/:id/offers', auth, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    if (pickup.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const offers = await Offer.find({ pickupId: req.params.id }).populate('recyclerId', 'name email phone');
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept an offer (for producers)
router.patch('/:id/accept-offer/:offerId', auth, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    if (pickup.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const offer = await Offer.findById(req.params.offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Update Pickup
    pickup.buyerId = offer.recyclerId;
    pickup.status = 'awaiting-transport';
    pickup.price = offer.price;
    await pickup.save();

    // Update Offer status
    offer.status = 'accepted';
    await offer.save();

    // Reject other offers
    await Offer.updateMany(
      { pickupId: pickup._id, _id: { $ne: offer._id } },
      { status: 'rejected' }
    );

    res.json({ message: 'Offer accepted successfully', pickup });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Direct Accept (for recyclers/buyers)
router.patch('/:id/direct-accept', auth, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    if (pickup.status !== 'pending') return res.status(400).json({ message: 'Listing is not available' });

    pickup.buyerId = req.user.userId;
    pickup.status = 'awaiting-transport';
    await pickup.save();

    res.json({ message: 'Listing accepted successfully!', pickup });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign Transporter (for recyclers/buyers)
router.patch('/:id/assign-transporter', auth, async (req, res) => {
  try {
    const { transporterId } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    if (pickup.buyerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the buyer can assign a transporter' });
    }

    pickup.transporterId = transporterId;
    // Status stays awaiting-transport until transporter accepts, 
    // or we can set it to 'accepted' immediately if the flow is direct.
    // Based on user thought "transporter take request", let's keep it as awaiting-transport
    // but with a transporterId assigned so the transporter sees it in "My Jobs" or similar.

    await pickup.save();

    res.json({ message: 'Transporter assigned successfully!', pickup });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all pickups (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const pickups = await Pickup.find()
      .populate('userId', 'name email')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete pickup (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    await Pickup.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pickup deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;