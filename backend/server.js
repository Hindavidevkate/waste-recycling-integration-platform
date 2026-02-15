// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pickups", require("./routes/pickups"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/waste-categories", require("./routes/wasteCategories"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/bids", require("./routes/bids"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/transporters", require("./routes/transporters"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/recyclers", require("./routes/recyclers"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

app.get("/", (req, res) => {
  res.send("Waste Recycling API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});