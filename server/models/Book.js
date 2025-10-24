// server/models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  googleBookId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, default: "Unknown Author" },
  coverImage: { type: String },
  status: {
    type: String,
    enum: ["Wishlist", "Reading", "Read"],
    default: "Wishlist"
  },
});

module.exports = mongoose.model("Book", bookSchema);
