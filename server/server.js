const mongoose = require('mongoose');
require('dotenv').config();

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

//  Enable CORS for all requests
app.use(cors());

// Example route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
