const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

//import the express.js framework
const express = require("express");
//allow the backend to communicate with the frontend
const cors = require("cors");

// Debug: check if .env is loading
console.log("MONGO_URI from .env:", process.env.MONGO_URI);

// Import routes modules where all endpoints for handling book data are defined
const bookRoutes = require("./routes/books");

const app = express(); //create an express application / instance
const PORT = process.env.PORT || 5000; // sets the port for the server to listen on
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) //starts the connection to the MongoDB database
  .then(() => console.log(" MongoDB connected")) //starts the server if the connection is successful
  .catch((err) => console.error(" MongoDB connection error:", err)); // logs an error if the connection fails

// Middleware
app.use(cors()); // allows cross-origin requests  from frontend
app.use(express.json()); // allows JSON request bodies  

// Routes
app.use("/api/books", bookRoutes); // all book-related endpoints are prefixed with /api/books

// Test route
app.get("/", (req, res) => { // basic route to test server
  res.send("Hello from backend!"); // sends a simple response to confirm server is running
});

// Start server
app.listen(PORT, () => { // starts the server and listens on the specified port
  console.log(` Server running on http://localhost:${PORT}`); // logs the server URL to the console
});
