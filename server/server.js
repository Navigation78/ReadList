const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import routes
const bookRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json()); // allows JSON request bodies

// Routes
app.use("/api/books", bookRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
