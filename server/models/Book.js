const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number },              // number of pages
  genres: { type: [String] },           // multiple genres allowed
  status: { 
    type: String, 
    enum: ["wishlist", "reading", "finished"], 
    default: "wishlist" 
  },
});

module.exports = mongoose.model("Book", bookSchema);
