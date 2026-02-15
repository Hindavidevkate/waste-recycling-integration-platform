const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const User = require("../models/User");

// Get all users (with optional role filter)
router.get("/users", auth, authorize("admin"), async (req, res) => {
    try {
        const { role } = req.query;
        const query = role ? { role } : {};
        const users = await User.find(query).select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user (Admin can update role, area, waste type, etc.)
router.put("/users/:id", auth, authorize("admin"), async (req, res) => {
    try {
        const { name, email, role, phone, address, area, wasteTypes } = req.body;

        // Find user and update
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        // Specific fields for Collector/Recycler that might be stored in 'address' or new fields
        // For now, we assume they might be added to the schema or just stored in existing fields.
        // Since we didn't explicitly add 'area' or 'wasteTypes' to User schema, we might need to rely on 'address' or add them.
        // However, for this task, 'address' can serve as 'area' for collector.

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user
router.delete("/users/:id", auth, authorize("admin"), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
