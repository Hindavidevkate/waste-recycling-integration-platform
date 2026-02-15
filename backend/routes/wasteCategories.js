const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const WasteCategory = require("../models/WasteCategory");

// Get all categories (Public)
router.get("/", async (req, res) => {
    try {
        const categories = await WasteCategory.find({ active: true });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new category (Admin only)
router.post("/", auth, authorize("admin"), async (req, res) => {
    try {
        const { name, description, pricePerKg, unit } = req.body;
        let category = await WasteCategory.findOne({ name });
        if (category) return res.status(400).json({ message: "Category already exists" });

        category = new WasteCategory({ name, description, pricePerKg, unit });
        await category.save();
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update category (Admin only)
router.put("/:id", auth, authorize("admin"), async (req, res) => {
    try {
        const category = await WasteCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete category (Soft delete - Admin only)
router.delete("/:id", auth, authorize("admin"), async (req, res) => {
    try {
        await WasteCategory.findByIdAndUpdate(req.params.id, { active: false });
        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
